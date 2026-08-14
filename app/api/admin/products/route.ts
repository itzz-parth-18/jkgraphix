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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await (prisma as any).product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customFields: true,
      },
    }).catch(() => []);

    // FIX: Har product object me 'price' property map kar rahe hain taaki frontend par ₹0 ki problem na aaye
    const formattedProducts = products.map((p: any) => ({
      ...p,
      price: p.basePrice ?? p.price ?? 0, // basePrice ko price map kar diya
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
  name, description, basePrice, price, sku, imageUrl, 
  thumbnailUrl, galleryUrls, fullDescription, shortDescription, categoryId, status,
  isFeatured, showOnHomepage, isSeasonal
} = body;

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
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
    // Dono (basePrice ya price) me se jo bhi aaye usko properly number me convert karo
    const finalPrice = Number(basePrice !== undefined ? basePrice : (price !== undefined ? price : 0));
    const finalSku = sku || `SKU-${Date.now()}`;
    const finalImageUrl = thumbnailUrl || imageUrl || (Array.isArray(galleryUrls) ? galleryUrls[0] : null);
    const finalDesc = fullDescription || description || shortDescription || name;

    const newProduct = await (prisma as any).product.create({
      data: {
        name,
        slug,
        description: finalDesc,
        basePrice: finalPrice, // Database column
        sku: finalSku,
        imageUrl: finalImageUrl,
        status: status || "PUBLISHED",
        categoryId: categoryId || null,
        productType: category.type,
        isFeatured: Boolean(isFeatured),
        showOnHomepage: Boolean(showOnHomepage),
        isSeasonal: Boolean(isSeasonal),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}