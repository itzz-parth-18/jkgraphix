import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({ action: "delete_products" }));
    const { action, reassignTargetId } = body;

    if (action === "reassign" && reassignTargetId) {
      await (prisma.product as any).updateMany({
        where: { categoryId: id },
        data: { categoryId: reassignTargetId },
      });
    } else {
      await (prisma.product as any).deleteMany({
        where: { categoryId: id },
      });
    }

    await (prisma as any).category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await (prisma as any).category.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        imageUrl: body.imageUrl || "",
        displayOrder: Number(body.displayOrder) || 0,
        isVisible: Boolean(body.isVisible),
        showOnHomepage: Boolean(body.showOnHomepage),
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}