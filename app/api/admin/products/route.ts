import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path if your prisma client is imported differently

// GET: Fetch all products from database
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        price: Number(body.price),
        shortDescription: body.shortDescription || "",
        fullDescription: body.fullDescription || "",
        thumbnailUrl: body.thumbnailUrl || "",
        galleryUrls: body.galleryUrls || [],
        productType: body.productType || "QUICK_CUSTOMIZE",
        requiresPhoto: Boolean(body.requiresPhoto),
        allowMultiplePhotos: Boolean(body.allowMultiplePhotos),
        requiresCustomName: Boolean(body.requiresCustomName),
        requiresCustomMessage: Boolean(body.requiresCustomMessage),
        requiresAdditionalNotes: Boolean(body.requiresAdditionalNotes),
        requiresDeliveryDate: Boolean(body.requiresDeliveryDate),
        status: body.status || "PUBLISHED",
        isFeatured: Boolean(body.isFeatured),
        showOnHomepage: Boolean(body.showOnHomepage),
        isSeasonal: Boolean(body.isSeasonal),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}