import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkgraphix.com';

  // Static Public Routes
  const staticRoutes = [
    '',
    '/shop',
    '/portfolio',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/shipping',
    '/refund',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch active published products from database safely
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await (prisma as any).product.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, updatedAt: true },
    }).catch(() => []);

    productRoutes = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    productRoutes = [];
  }

  return [...staticRoutes, ...productRoutes];
}