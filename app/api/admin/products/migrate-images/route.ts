import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { UTApi, UTFile } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    // Admin-only protection
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const requestedId =
      typeof body?.id === "string" ? body.id.trim() : "";

    // If an ID is provided, migrate only that product.
    // Otherwise migrate all products containing Base64 images.
    const products = await prisma.product.findMany({
      where: requestedId
        ? {
            id: requestedId,
            imageUrl: {
              startsWith: "data:image/",
            },
          }
        : {
            imageUrl: {
              startsWith: "data:image/",
            },
          },
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: requestedId
          ? "No Base64 image found for this product."
          : "No products with Base64 images found.",
        migrated: 0,
        failed: 0,
      });
    }

    const results: Array<{
      id: string;
      name: string;
      success: boolean;
      url?: string;
      error?: string;
    }> = [];

    for (const product of products) {
      try {
        const imageUrl = product.imageUrl;

        if (!imageUrl || !imageUrl.startsWith("data:image/")) {
          continue;
        }

        /*
         * Expected format:
         * data:image/jpeg;base64,/9j/4AAQ...
         */
        const match = imageUrl.match(
          /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
        );

        if (!match) {
          throw new Error("Invalid Base64 image format.");
        }

        const mimeType = match[1];
        const base64Data = match[2];

        const extension =
          mimeType === "image/jpeg"
            ? "jpg"
            : mimeType === "image/png"
              ? "png"
              : mimeType === "image/webp"
                ? "webp"
                : mimeType === "image/gif"
                  ? "gif"
                  : "bin";

        const buffer = Buffer.from(base64Data, "base64");

        if (!buffer.length) {
          throw new Error("Decoded image is empty.");
        }

        const fileName = `product-${product.id}.${extension}`;

        const file = new UTFile(
          [buffer],
          fileName,
          {
            type: mimeType,
          }
        );

        const uploadResult = await utapi.uploadFiles(file);

        if (uploadResult.error || !uploadResult.data) {
          throw new Error(
            uploadResult.error?.message ||
              "UploadThing upload failed."
          );
        }

        const uploadedUrl = uploadResult.data.url;

        if (!uploadedUrl) {
          throw new Error(
            "UploadThing did not return a file URL."
          );
        }

        // Only update imageUrl.
        // No other product field is touched.
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            imageUrl: uploadedUrl,
          },
        });

        results.push({
          id: product.id,
          name: product.name,
          success: true,
          url: uploadedUrl,
        });
      } catch (error) {
        console.error(
          `Failed to migrate image for product ${product.id}:`,
          error
        );

        results.push({
          id: product.id,
          name: product.name,
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unknown migration error",
        });
      }
    }

    const migrated = results.filter(
      (result) => result.success
    ).length;

    const failed = results.filter(
      (result) => !result.success
    ).length;

    return NextResponse.json({
      success: failed === 0,
      message: `Migration completed. ${migrated} migrated, ${failed} failed.`,
      migrated,
      failed,
      results,
    });
  } catch (error) {
    console.error(
      "Product image migration error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to migrate product images.",
      },
      { status: 500 }
    );
  }
}