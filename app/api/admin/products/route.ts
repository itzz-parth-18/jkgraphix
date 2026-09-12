import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug || "product";
  let counter = 1;

  while (true) {
    const existing = await (prisma as any).product.findUnique({
      where: { slug },
    });

    if (!existing) break;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const products = await (prisma as any).product
      .findMany({
        orderBy: { createdAt: "desc" },
        include: {
          customFields: true,
        },
      })
      .catch(() => []);

    const formattedProducts = products.map((p: any) => ({
      ...p,
      price: p.basePrice ?? p.price ?? 0,
      galleryUrls: Array.isArray(p.galleryUrls)
        ? p.galleryUrls
        : [],
    }));

    return NextResponse.json(formattedProducts, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);

    return NextResponse.json([], {
      status: 200,
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      name,
      description,
      basePrice,
      price,
      sku,
      imageUrl,
      thumbnailUrl,
      galleryUrls,
      fullDescription,
      shortDescription,
      categoryId,
      status,

      // Visibility
      isFeatured,
      showOnHomepage,
      isSeasonal,

      // Product customization
      requiresPhoto,
      allowMultiplePhotos,
      photoMinCount,
      photoMaxCount,
      requiresCustomName,
      requiresCustomMessage,
      requiresAdditionalNotes,
      requiresDeliveryDate,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { type: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Selected category not found" },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(name);

    const finalPrice = Number(
      basePrice !== undefined
        ? basePrice
        : price !== undefined
          ? price
          : 0
    );

    const finalSku = sku || `SKU-${Date.now()}`;

    const normalizedGalleryUrls = Array.isArray(galleryUrls)
      ? galleryUrls.filter(
          (url: unknown): url is string =>
            typeof url === "string" && url.trim().length > 0
        )
      : [];

    const finalImageUrl =
      thumbnailUrl ||
      imageUrl ||
      normalizedGalleryUrls[0] ||
      null;

    const finalDesc =
      fullDescription ||
      description ||
      shortDescription ||
      name;

    // Normalize photo configuration.
    const finalRequiresPhoto = Boolean(requiresPhoto);
    const finalAllowMultiplePhotos = Boolean(
      allowMultiplePhotos
    );

    let finalPhotoMinCount = Math.max(
      0,
      Number(
        photoMinCount ??
          (finalRequiresPhoto ? 1 : 0)
      )
    );

    let finalPhotoMaxCount = Math.max(
      1,
      Number(
        photoMaxCount ??
          (finalAllowMultiplePhotos
            ? Math.max(finalPhotoMinCount, 1)
            : 1)
      )
    );

    // Keep configuration logically valid.
    if (!finalAllowMultiplePhotos) {
      finalPhotoMaxCount = 1;
    }

    if (finalPhotoMinCount > finalPhotoMaxCount) {
      finalPhotoMinCount = finalPhotoMaxCount;
    }

    if (
      finalRequiresPhoto &&
      finalPhotoMinCount < 1
    ) {
      finalPhotoMinCount = 1;
    }

    const newProduct = await (prisma as any).product.create({
      data: {
        name,
        slug,
        description: finalDesc,
        basePrice: finalPrice,
        sku: finalSku,

        // Main/thumbnail image.
        imageUrl: finalImageUrl,

        // Ordered product gallery.
        galleryUrls: normalizedGalleryUrls,

        status: status || "PUBLISHED",
        categoryId: categoryId || null,
        productType: category.type,

        // Visibility.
        isFeatured: Boolean(isFeatured),
        showOnHomepage: Boolean(showOnHomepage),
        isSeasonal: Boolean(isSeasonal),

        // Product customization.
        requiresPhoto: finalRequiresPhoto,
        allowMultiplePhotos: finalAllowMultiplePhotos,
        photoMinCount: finalPhotoMinCount,
        photoMaxCount: finalPhotoMaxCount,
        requiresCustomName: Boolean(
          requiresCustomName
        ),
        requiresCustomMessage: Boolean(
          requiresCustomMessage
        ),
        requiresAdditionalNotes: Boolean(
          requiresAdditionalNotes
        ),
        requiresDeliveryDate: Boolean(
          requiresDeliveryDate
        ),
      },
    });

    return NextResponse.json(newProduct, {
      status: 201,
    });
  } catch (error: any) {
    console.error(
      "Error creating product:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to create product",
      },
      { status: 500 }
    );
  }
}