import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE: Delete a product by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

// PUT: Update a product by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}