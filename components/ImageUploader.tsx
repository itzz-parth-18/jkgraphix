"use client";

import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";

type Props = {
  onUploadComplete: (url: string) => void;
  endpoint?: keyof OurFileRouter;
};

export default function ImageUploader({ onUploadComplete, endpoint = "customerPhotoUploader" as any }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full">
      <UploadButton<OurFileRouter, any>
        endpoint={endpoint}
        appearance={{
          button: "bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-5 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm ut-readying:bg-gray-400 cursor-pointer",
          container: "border-2 border-dashed border-[#EFE8E2] rounded-2xl p-6 bg-[#F9F6F2] flex flex-col items-center justify-center gap-3 hover:border-[#C89A84] transition cursor-pointer",
          allowedContent: "text-xs text-[#6E625C] mt-1"
        }}
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res: any) => {
          setIsUploading(false);
          if (res && res[0]) {
            const url = res[0].ufsUrl || res[0].url;
            if (url) {
              onUploadComplete(url);
            }
          }
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}