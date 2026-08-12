import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await (prisma as any).category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { displayOrder: "asc" },
    }).catch(() => []);

    const formatted = categories.map((c: any) => ({
      ...c,
      productCount: c._count?.products || 0,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newCategory = await (prisma as any).category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        imageUrl: body.imageUrl || "",
        displayOrder: Number(body.displayOrder) || 0,
        isVisible: Boolean(body.isVisible),
        showOnHomepage: Boolean(body.showOnHomepage),
        isFeatured: Boolean(body.isFeatured),
        type: body.type || "QUICK_CUSTOMIZE", // NAYA FIELD
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}