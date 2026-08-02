import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/product/ProductDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await (prisma as any).product.findUnique({
    where: {
      slug,
    },
    include: {
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
};

const serializedRelatedProducts = relatedProducts.map((item: any) => ({
  ...item,
  basePrice: Number(item.basePrice),
}));

  return (
    <ProductDetailClient
  product={serializedProduct}
  relatedProducts={serializedRelatedProducts}
/>
  );
}