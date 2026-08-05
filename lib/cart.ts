import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCart() {
  const session = await auth();


  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
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