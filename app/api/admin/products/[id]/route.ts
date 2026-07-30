// ==========================================
// 2. Product Update & Delete API Route
// Location: app/api/admin/products/[id]/route.ts
// ==========================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, basePrice, price, sku, imageUrl, status } = body;

    const finalPrice = basePrice !== undefined ? basePrice : (price !== undefined ? price : 0);

    const updatedProduct = await (prisma as any).product.update({
      where: { id },
      data: {
        name,
        description,
        basePrice: finalPrice,
        sku,
        imageUrl,
        status: status || "PUBLISHED",
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("Error updating product:", error);
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