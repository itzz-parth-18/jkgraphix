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

  // Check uniqueness in database and append counter if exists
  while (true) {
    const existing = await prisma.product.findUnique({
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

// GET: Fetch all products with category and custom fields
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        customFields: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new product with auto-generated unique slug
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      description, 
      basePrice, 
      price, 
      sku, 
      imageUrl, 
      thumbnailUrl, 
      galleryUrls, 
      categoryId, 
      categoryName, 
      productType, 
      status, 
      isFeatured, 
      showOnHomepage, 
      isSeasonal, 
      customizationSettings, 
      shortDescription, 
      fullDescription 
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    // Automatically generate a unique slug from product name
    const slug = await generateUniqueSlug(name);

    // Fallbacks for price and sku
    const finalPrice = basePrice !== undefined ? basePrice : (price !== undefined ? price : 0);
    const finalSku = sku || `SKU-${Date.now()}`;
    const finalImageUrl = thumbnailUrl || imageUrl || (Array.isArray(galleryUrls) ? galleryUrls[0] : null);
    const finalDesc = fullDescription || description || shortDescription || name;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description: finalDesc,
        basePrice: finalPrice,
        sku: finalSku,
        imageUrl: finalImageUrl,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}