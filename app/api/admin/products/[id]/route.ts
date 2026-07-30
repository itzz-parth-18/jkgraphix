import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to generate a unique slug
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

    if (!existing) {
      break;
    }

    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// GET: Fetch all products cleanly
export async function GET() {
  try {
    const products = await (prisma as any).product.findMany({
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST: Create a new product handling all form fields properly
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DEBUG CREATE PRODUCT PAYLOAD:", body);

    const { 
      name, 
      description, 
      basePrice, 
      price, 
      sku, 
      imageUrl, 
      thumbnailUrl, 
      fullDescription, 
      shortDescription,
      status 
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const slug = await generateUniqueSlug(name);

    const finalPrice = basePrice !== undefined && basePrice !== "" ? Number(basePrice) : (price !== undefined && price !== "" ? Number(price) : 0);
    const finalSku = sku || `SKU-${Date.now()}`;
    const finalImageUrl = thumbnailUrl || imageUrl || "";
    const finalDesc = fullDescription || description || shortDescription || name;
    const finalStatus = status || "PUBLISHED";

    const newProduct = await (prisma as any).product.create({
      data: {
        name,
        slug,
        description: finalDesc,
        basePrice: finalPrice,
        sku: finalSku,
        imageUrl: finalImageUrl,
        status: finalStatus,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product API:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}