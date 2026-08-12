import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await (prisma as any).product.findUnique({
    where: { slug },
    select: { name: true, description: true, imageUrl: true },
  }).catch(() => null);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const imageUrl = product.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60";

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} custom crafted by JK Graphix.`,
    openGraph: {
      title: `${product.name} | JK Graphix`,
      description: product.description || `Buy ${product.name} custom crafted by JK Graphix.`,
      url: `/shop/${slug}`,
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await (prisma as any).product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true, // NAYA: Include category taaki hume type pata chale
      customFields: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await (prisma as any).product.findMany({
    where: {
      status: "PUBLISHED",
      id: {
        not: product.id,
      },
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice),
    productType: product.category?.type || "QUICK_CUSTOMIZE", // NAYA: Type Client component bhej rahe hain
  };

  const serializedRelatedProducts = relatedProducts.map((item: any) => ({
    ...item,
    basePrice: Number(item.basePrice),
  }));

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60",
    "description": product.description || `Custom printed ${product.name} by JK Graphix.`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": Number(product.basePrice),
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={serializedProduct}
        relatedProducts={serializedRelatedProducts}
      />
    </>
  );
}