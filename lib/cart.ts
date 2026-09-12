import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCart(userId?: string) {
  let resolvedUserId = userId;

  if (!resolvedUserId) {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    resolvedUserId = user?.id;
  }

  if (!resolvedUserId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: resolvedUserId,
    },
    include: {
      cart: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  customFields: {
                    orderBy: {
                      sortOrder: "asc",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return user?.cart ?? null;
}

/**
 * Lightweight cart query for payment/order creation.
 *
 * Only fetches data required to calculate the server-side amount
 * and create the internal order.
 */
export async function getPaymentCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              basePrice: true,
            },
          },
        },
      },
    },
  });

  return cart;
}