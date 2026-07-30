// ==========================================
// 3. Customer Shop API Route (Published Only)
// Location: app/api/shop/products/route.ts
// ==========================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch only PUBLISHED products for the customer-facing shop page
    const products = await (prisma as any).product.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    const formatted = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.basePrice) || 0,
      imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60",
      category: "Memory Boxes",
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching shop products:", error);
    return NextResponse.json([], { status: 200 });
  }
}