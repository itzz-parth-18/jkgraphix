import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const fields = await (prisma as any).customField.findMany({
      where: {
        productId: id,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json(fields);
  } catch (error) {
    console.error(error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: Params
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const field = await (prisma as any).customField.create({
      data: {
        productId: id,
        label: body.label,
        fieldType: body.fieldType,
        isRequired: body.isRequired,
        placeholder: body.placeholder,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return NextResponse.json(field);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create custom field" },
      { status: 500 }
    );
  }
}