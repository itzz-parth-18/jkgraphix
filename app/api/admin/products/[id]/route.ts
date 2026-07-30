import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { name, description, basePrice, price, sku, imageUrl, status } = body;

    const finalPrice = basePrice !== undefined && basePrice !== "" ? Number(basePrice) : (price !== undefined && price !== "" ? Number(price) : 0);

    // Normalize status to match standard uppercase database values
    let finalStatus = "PUBLISHED";
    if (status) {
      const upperStatus = status.toString().toUpperCase();
      if (upperStatus.includes("DRAFT")) finalStatus = "DRAFT";
      else if (upperStatus.includes("OUT") || upperStatus.includes("STOCK")) finalStatus = "OUT_OF_STOCK";
      else finalStatus = "PUBLISHED";
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (finalPrice !== undefined) updateData.basePrice = finalPrice;
    if (sku !== undefined) updateData.sku = sku;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    updateData.status = finalStatus;

    const updatedProduct = await (prisma as any).product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("Error updating product API:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await (prisma as any).product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}