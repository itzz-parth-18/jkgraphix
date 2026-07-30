import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { displayOrder: "asc" },
    });

    const formatted = categories.map((c: any) => ({
      ...c,
      productCount: c._count?.products || 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    // Fallback if category table is not yet migrated, return empty array to prevent dashboard crash
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newCategory = await prisma.category.create({
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

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}