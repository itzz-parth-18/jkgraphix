import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";

function getPhotoUrls(customizations: any): string[] {
  if (!customizations || typeof customizations !== "object") {
    return [];
  }

  if (Array.isArray(customizations.photos)) {
    return customizations.photos.filter(
      (url: unknown): url is string =>
        typeof url === "string" && url.trim().length > 0
    );
  }

  const legacyPhoto =
    customizations.customPhotoUrl || customizations.photo_upload;

  return typeof legacyPhoto === "string" && legacyPhoto.trim()
    ? [legacyPhoto]
    : [];
}

function normalizePhotoConfig(product: any) {
  let min = Number(product.photoMinCount ?? 0);
  let max = Number(product.photoMaxCount ?? 1);

  if (!Number.isFinite(min) || min < 0) {
    min = 0;
  }

  if (!Number.isFinite(max) || max < 1) {
    max = 1;
  }

  min = Math.floor(min);
  max = Math.floor(max);

  if (max < min) {
    max = min;
  }

  const requiresPhoto = Boolean(product.requiresPhoto) || min > 0;
  const allowMultiplePhotos =
    Boolean(product.allowMultiplePhotos) || max > 1;

  if (!allowMultiplePhotos) {
    max = Math.min(max, 1);
    min = Math.min(min, 1);
  }

  return {
    min,
    max,
    requiresPhoto,
    allowMultiplePhotos,
  };
}

function validateCustomizations(product: any, customizations: any) {
  const data =
    customizations && typeof customizations === "object"
      ? customizations
      : {};

  const errors: string[] = [];

  /*
   * PHOTO VALIDATION
   */
  const photoConfig = normalizePhotoConfig(product);
  const photos = getPhotoUrls(data);

  if (photoConfig.requiresPhoto && photos.length < photoConfig.min) {
    errors.push(
      photoConfig.min === 1
        ? "Please upload a photo."
        : `Please upload at least ${photoConfig.min} photos.`
    );
  }

  if (photos.length > photoConfig.max) {
    errors.push(
      photoConfig.max === 1
        ? "Only 1 photo can be uploaded."
        : `You can upload a maximum of ${photoConfig.max} photos.`
    );
  }

  if (!photoConfig.allowMultiplePhotos && photos.length > 1) {
    errors.push("Only 1 photo can be uploaded for this product.");
  }

  /*
   * CUSTOM NAME
   */
  if (
    product.requiresCustomName &&
    (!data.customName || String(data.customName).trim().length === 0)
  ) {
    errors.push("Custom name is required.");
  }

  /*
   * CUSTOM MESSAGE
   */
  if (
    product.requiresCustomMessage &&
    (!data.customMessage || String(data.customMessage).trim().length === 0)
  ) {
    errors.push("Custom message is required.");
  }

  /*
   * ADDITIONAL NOTES
   */
  if (
    product.requiresAdditionalNotes &&
    (!data.additionalNotes ||
      String(data.additionalNotes).trim().length === 0)
  ) {
    errors.push("Additional notes are required.");
  }

  /*
   * DELIVERY DATE
   */
  if (
    product.requiresDeliveryDate &&
    (!data.deliveryDate || String(data.deliveryDate).trim().length === 0)
  ) {
    errors.push("Delivery date is required.");
  }

  return errors;
}

export async function GET() {
  try {
    const cart = await getCart();

    if (!cart) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("GET /api/cart ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        message: error?.message,
        code: error?.code,
        meta: error?.meta,
        stack:
          process.env.NODE_ENV === "development"
            ? error?.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      productId,
      quantity,
      customizations,
    } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    const requestedQuantity = Number(quantity ?? 1);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return NextResponse.json(
        { error: "Invalid quantity." },
        { status: 400 }
      );
    }

    /*
     * IMPORTANT:
     * Fetch the product from DB before accepting customization data.
     * This prevents client-side validation from being the only protection.
     */
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    /*
     * SERVER-SIDE CUSTOMIZATION VALIDATION
     */
    const customizationErrors = validateCustomizations(
      product,
      customizations
    );

    if (customizationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid customization.",
          validationErrors: customizationErrors,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        cart: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    let cart = user.cart;

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    const existingItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    const matchingItem = existingItems.find(
      (item) =>
        JSON.stringify(item.customizations ?? {}) ===
        JSON.stringify(customizations ?? {})
    );

    if (matchingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: {
          id: matchingItem.id,
        },
        data: {
          quantity:
            matchingItem.quantity + requestedQuantity,
        },
      });

      return NextResponse.json(updatedItem);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: requestedQuantity,
        customizations,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("POST /api/cart ERROR:");
    console.error(error);

    return NextResponse.json(
      { error: "Failed to add item to cart." },
      { status: 500 }
    );
  }
}