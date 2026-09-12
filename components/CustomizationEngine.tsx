"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  Calendar,
  Type,
  CheckCircle,
  Trash2,
} from "lucide-react";

export type CustomField = {
  id: string;
  label: string;
  fieldType:
    | "SHORT_TEXT"
    | "LONG_TEXT"
    | "DATE_PICKER"
    | "IMAGE_UPLOAD"
    | "COLOR_SELECT";
  isRequired: boolean;
  placeholder?: string;
  maxLength?: number;
  helpText?: string;
};

interface CustomizationEngineProps {
  fields: CustomField[];
  onChange?: (data: Record<string, any>) => void;
}

export default function CustomizationEngine({
  fields,
  onChange,
}: CustomizationEngineProps) {
  const { data: session, status: sessionStatus } = useSession();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [imagePreviews, setImagePreviews] = useState<
    Record<string, string>
  >({});

  const handleInputChange = (fieldId: string, value: any) => {
    const updated = { ...formData, [fieldId]: value };

    setFormData(updated);

    if (onChange) {
      onChange(updated);
    }
  };

  const removeImage = (fieldId: string) => {
    const updatedPreviews = { ...imagePreviews };

    delete updatedPreviews[fieldId];

    setImagePreviews(updatedPreviews);

    const updatedData = { ...formData };

    delete updatedData[fieldId];

    setFormData(updatedData);

    if (onChange) {
      onChange(updatedData);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-taupe-border bg-cream-dark/50 p-4 shadow-sm sm:space-y-6 sm:p-6">
      <div className="border-b border-taupe-border/60 pb-3 sm:pb-4">
        <h3 className="font-serif text-lg font-medium text-espresso sm:text-xl">
          Personalize Your Order
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-taupe">
          Handcrafted specifically for you. Please double check spelling and
          details.
        </p>
      </div>

      <div className="space-y-5">
        {fields.map((field) => {
          return (
            <div key={field.id} className="space-y-2">
              <label className="flex items-start justify-between gap-3 text-sm font-medium text-espresso">
                <span className="min-w-0">
                  {field.label}

                  {field.isRequired && (
                    <span className="ml-1 text-rose-muted">*</span>
                  )}
                </span>

                {field.maxLength && formData[field.id] && (
                  <span className="shrink-0 text-xs text-taupe">
                    {formData[field.id].length}/{field.maxLength}
                  </span>
                )}
              </label>

              {/* SHORT TEXT INPUT */}
              {field.fieldType === "SHORT_TEXT" && (
                <div className="relative">
                  <input
                    type="text"
                    maxLength={field.maxLength}
                    placeholder={
                      field.placeholder || "Enter details..."
                    }
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full rounded-xl border border-taupe-border bg-white px-3 py-3 pr-10 text-sm text-espresso placeholder:text-taupe-light transition focus:outline-none focus:ring-2 focus:ring-rose/50 sm:px-4"
                  />

                  <Type className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-taupe-light" />
                </div>
              )}

              {/* LONG TEXT INPUT */}
              {field.fieldType === "LONG_TEXT" && (
                <textarea
                  rows={4}
                  maxLength={field.maxLength}
                  placeholder={
                    field.placeholder || "Write your message..."
                  }
                  value={formData[field.id] || ""}
                  onChange={(e) =>
                    handleInputChange(field.id, e.target.value)
                  }
                  className="w-full resize-none rounded-xl border border-taupe-border bg-white px-3 py-3 text-sm text-espresso placeholder:text-taupe-light transition focus:outline-none focus:ring-2 focus:ring-rose/50 sm:px-4"
                />
              )}

              {/* DATE PICKER */}
              {field.fieldType === "DATE_PICKER" && (
                <div className="relative">
                  <input
                    type="date"
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full rounded-xl border border-taupe-border bg-white px-3 py-3 pr-10 text-sm text-espresso transition focus:outline-none focus:ring-2 focus:ring-rose/50 sm:px-4"
                  />

                  <Calendar className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-taupe-light" />
                </div>
              )}

              {/* IMAGE UPLOAD */}
              {field.fieldType === "IMAGE_UPLOAD" && (
                <div>
                  {!imagePreviews[field.id] ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-taupe-border bg-white p-4 transition hover:border-rose hover:bg-rose-light/20 sm:p-6">
                      {sessionStatus === "loading" ? (
                        <span className="text-xs text-taupe">
                          Checking login status...
                        </span>
                      ) : !session ? (
                        <>
                          <span className="text-center text-xs font-medium text-espresso">
                            Login required to upload photo
                          </span>

                          <span className="mb-3 mt-1 text-center text-[10px] text-taupe">
                            PNG, JPG up to 8MB
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              window.location.href =
                                "/login?callbackUrl=" +
                                encodeURIComponent(
                                  window.location.pathname
                                );
                            }}
                            className="cursor-pointer rounded-xl bg-[#1F1816] px-5 py-2.5 text-xs font-medium text-[#F9F6F2] shadow-sm transition hover:bg-[#322724]"
                          >
                            Login to Upload Photo
                          </button>
                        </>
                      ) : (
                        <>
                          <UploadButton<
                            OurFileRouter,
                            "customerPhotoUploader"
                          >
                            endpoint="customerPhotoUploader"
                            appearance={{
                              button:
                                "bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-5 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm cursor-pointer ut-readying:bg-gray-400",
                              container:
                                "flex w-full flex-col items-center justify-center gap-2",
                              allowedContent:
                                "mt-1 text-center text-[10px] text-taupe",
                            }}
                            onClientUploadComplete={(res) => {
                              if (res && res[0]) {
                                const url =
                                  res[0].ufsUrl || res[0].url;

                                if (url) {
                                  setImagePreviews((prev) => ({
                                    ...prev,
                                    [field.id]: url,
                                  }));

                                  handleInputChange(field.id, url);
                                }
                              }
                            }}
                            onUploadError={(error) => {
                              alert(
                                `Upload failed: ${error.message}`
                              );
                            }}
                          />

                          <span className="mt-1 text-center text-[10px] text-taupe">
                            PNG, JPG up to 8MB
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-taupe-border bg-white p-2 sm:gap-3 sm:p-3">
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <img
                          src={imagePreviews[field.id]}
                          alt="Uploaded photo"
                          className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
                        />

                        <div className="min-w-0">
                          <p className="flex items-center gap-1 text-xs font-medium text-espresso">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0 text-sage" />
                            Photo Attached
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-taupe">
                            Uploaded successfully
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(field.id)}
                        className="flex shrink-0 items-center justify-center rounded-lg p-2 text-taupe transition hover:bg-rose-50 hover:text-red-500"
                        title="Remove photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* HELPER TEXT */}
              {field.helpText && (
                <p className="mt-1 text-[11px] italic leading-relaxed text-taupe">
                  {field.helpText}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}