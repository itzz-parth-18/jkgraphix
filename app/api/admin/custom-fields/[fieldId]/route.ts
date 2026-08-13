import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Params = {
  params: Promise<{
    fieldId: string;
  }>;
};

export async function PUT(
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

  const { fieldId } = await params;

  try {
    const body = await request.json();

    const field = await (prisma as any).customField.update({
      where: {
        id: fieldId,
      },
      data: {
        label: body.label,
        fieldType: body.fieldType,
        placeholder: body.placeholder,
        isRequired: body.isRequired,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(field);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update field" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

  const { fieldId } = await params;

  try {
    await (prisma as any).customField.delete({
      where: {
        id: fieldId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete field" },
      { status: 500 }
    );
  }
}