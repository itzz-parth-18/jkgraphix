import { prisma } from "@/lib/prisma";
import HeroClient from "./HeroClient";

export default async function Hero() {
  // Pehle check karenge ki admin ne kis product ko homepage ke liye select kiya hai
  let featuredProduct = await (prisma as any).product.findFirst({
    where: { 
      status: "PUBLISHED",
      showOnHomepage: true 
    },
    orderBy: { updatedAt: "desc" },
  }).catch(() => null);

  // Agar koi explicitly select nahi hai, toh koi bhi latest published product utha lo
  if (!featuredProduct) {
    featuredProduct = await (prisma as any).product.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    }).catch(() => null);
  }

  const productUrl = featuredProduct ? `/shop/${featuredProduct.slug}` : "/shop";
  const productName = featuredProduct?.name || "Premium Custom Gift";
  const productImage = featuredProduct?.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop";
  const productPrice = featuredProduct?.basePrice ? `₹${Number(featuredProduct.basePrice).toFixed(2)}` : "Made Just For You";

  return (
    <HeroClient
      productUrl={productUrl}
      productName={productName}
      productImage={productImage}
      productPrice={productPrice}
    />
  );
}