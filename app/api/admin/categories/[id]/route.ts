import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const productCount = await (prisma as any).product.count({
      where: { categoryId: id }
    }).catch(() => 0);

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete. This category is used by ${productCount} product(s).` }, 
        { status: 400 } 
      );
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
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        type: body.type, // NAYA FIELD UPDATE KE LIYE
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}