import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";

type Params = Promise<{
  id: string;
}>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await params;

  const body = await request.json();

const status = body.status as OrderStatus | undefined;
const paymentStatus =
  body.paymentStatus as PaymentStatus | undefined;

  const order = await prisma.order.update({
  where: {
    id,
  },
  data: {
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
  },
});

return NextResponse.json(order);
}