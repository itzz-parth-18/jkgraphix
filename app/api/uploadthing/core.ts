import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  customerPhotoUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.id) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        uploadedBy: session.user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Uploaded Cloud URL:", file.url);

      return {
        fileUrl: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;