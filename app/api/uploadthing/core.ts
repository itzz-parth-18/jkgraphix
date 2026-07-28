import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  customerPhotoUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
  })
    .middleware(async () => {
      return { uploadedBy: "Customer" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Uploaded Cloud URL:", file.url);
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;