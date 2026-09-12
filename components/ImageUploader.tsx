"use client";

import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";

type Props = {
  onUploadComplete: (url: string) => void;
  onMultipleUploadComplete?: (urls: string[]) => void;
  endpoint?: keyof OurFileRouter;
};

export default function ImageUploader({
  onUploadComplete,
  onMultipleUploadComplete,
  endpoint = "customerPhotoUploader" as any,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full">
      <UploadButton<OurFileRouter, any>
        endpoint={endpoint}
        appearance={{
          button:
            "bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-5 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm ut-readying:bg-gray-400 cursor-pointer",
          container:
            "border-2 border-dashed border-[#EFE8E2] rounded-2xl p-6 bg-[#F9F6F2] flex flex-col items-center justify-center gap-3 hover:border-[#C89A84] transition cursor-pointer",
          allowedContent:
            "text-xs text-[#6E625C] mt-1",
        }}
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res: any) => {
          setIsUploading(false);

          if (!res || !Array.isArray(res) || res.length === 0) {
            return;
          }

          const urls = res
            .map((file: any) => file?.ufsUrl || file?.url)
            .filter(
              (url: unknown): url is string =>
                typeof url === "string" && url.length > 0
            );

          if (urls.length === 0) {
            return;
          }

          // Multi-upload mode.
          // Used by Gallery Images.
          if (onMultipleUploadComplete) {
            onMultipleUploadComplete(urls);
            return;
          }

          // Existing single-upload behaviour.
          // Used by Thumbnail and other existing uploaders.
          onUploadComplete(urls[0]);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          alert(`Upload failed: ${error.message}`);
        }}
      />

      {isUploading && (
        <p className="mt-2 text-xs text-[#6E625C] text-center">
          Uploading images...
        </p>
      )}
    </div>
  );
}