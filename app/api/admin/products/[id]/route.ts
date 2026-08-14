import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { name, description, basePrice, price, sku, imageUrl, status } = body;

    const finalPrice = basePrice !== undefined && basePrice !== "" ? Number(basePrice) : (price !== undefined && price !== "" ? Number(price) : 0);

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
    
  if (body.categoryId !== undefined) {
  if (!body.categoryId) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: body.categoryId },
    select: { type: true },
  });

  if (!category) {
    return NextResponse.json(
      { error: "Selected category not found" },
      { status: 400 }
    );
  }

  updateData.categoryId = body.categoryId;
  updateData.productType = category.type;
}
    
    // Visibility Checkboxes Save Logic
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.showOnHomepage !== undefined) updateData.showOnHomepage = Boolean(body.showOnHomepage);
    if (body.isSeasonal !== undefined) updateData.isSeasonal = Boolean(body.isSeasonal);
    
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
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check for blocking active/incomplete orders
    const blockingOrderItems = await prisma.orderItem.findMany({
      where: {
        productId: id,
        order: {
          adminDeletedAt: null,
          status: {
            notIn: ["COMPLETED", "CANCELLED"],
          },
        },
      },
      select: {
        orderId: true,
      },
    });

    if (blockingOrderItems.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete this product because it is linked to ${blockingOrderItems.length} active order(s). Complete or delete those order(s) first.`,
        },
        { status: 400 }
      );
    }

    // Delete the product. Historical completed order items will remain 
    // due to onDelete: SetNull on the relation.
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}