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
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {}
  );

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
    <div className="bg-cream-dark/50 border border-taupe-border rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="border-b border-taupe-border/60 pb-4">
        <h3 className="font-serif text-xl font-medium text-espresso">
          Personalize Your Order
        </h3>

        <p className="text-xs text-taupe mt-1">
          Handcrafted specifically for you. Please double check spelling and
          details.
        </p>
      </div>

      <div className="space-y-5">
        {fields.map((field) => {
          return (
            <div key={field.id} className="space-y-2">
              <label className="flex items-center justify-between text-sm font-medium text-espresso">
                <span>
                  {field.label}
                  {field.isRequired && (
                    <span className="text-rose-muted ml-1">*</span>
                  )}
                </span>

                {field.maxLength && formData[field.id] && (
                  <span className="text-xs text-taupe">
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
                    placeholder={field.placeholder || "Enter details..."}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white border border-taupe-border rounded-xl text-sm text-espresso placeholder:text-taupe-light focus:outline-none focus:ring-2 focus:ring-rose/50 transition"
                  />

                  <Type className="w-4 h-4 text-taupe-light absolute right-3 top-3.5" />
                </div>
              )}

              {/* LONG TEXT INPUT */}
              {field.fieldType === "LONG_TEXT" && (
                <textarea
                  rows={3}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder || "Write your message..."}
                  value={formData[field.id] || ""}
                  onChange={(e) =>
                    handleInputChange(field.id, e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-taupe-border rounded-xl text-sm text-espresso placeholder:text-taupe-light focus:outline-none focus:ring-2 focus:ring-rose/50 transition resize-none"
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
                    className="w-full px-4 py-3 bg-white border border-taupe-border rounded-xl text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-rose/50 transition"
                  />

                  <Calendar className="w-4 h-4 text-taupe-light absolute right-3 top-3.5 pointer-events-none" />
                </div>
              )}

              {/* IMAGE UPLOAD */}
              {field.fieldType === "IMAGE_UPLOAD" && (
                <div>
                  {!imagePreviews[field.id] ? (
                    <div className="border-2 border-dashed border-taupe-border hover:border-rose rounded-xl p-6 flex flex-col items-center justify-center bg-white transition hover:bg-rose-light/20">
                      {sessionStatus === "loading" ? (
                        <span className="text-xs text-taupe">
                          Checking login status...
                        </span>
                      ) : !session ? (
                        <>
                          <span className="text-xs font-medium text-espresso">
                            Login required to upload photo
                          </span>

                          <span className="text-[10px] text-taupe mt-1 mb-3">
                            PNG, JPG up to 8MB
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              window.location.href =
                                "/login?callbackUrl=" +
                                encodeURIComponent(window.location.pathname);
                            }}
                            className="bg-[#1F1816] text-[#F9F6F2] font-medium text-xs px-5 py-2.5 rounded-xl hover:bg-[#322724] transition shadow-sm cursor-pointer"
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
                                "flex flex-col items-center justify-center gap-2 w-full",
                              allowedContent:
                                "text-[10px] text-taupe mt-1",
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

                          <span className="text-[10px] text-taupe mt-1">
                            PNG, JPG up to 8MB
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-taupe-border bg-white p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={imagePreviews[field.id]}
                          alt="Uploaded photo"
                          className="w-14 h-14 object-cover rounded-lg"
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-espresso flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-sage" />
                            Photo Attached
                          </p>

                          <p className="text-[11px] text-taupe truncate max-w-[180px]">
                            Uploaded successfully
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(field.id)}
                        className="p-2 text-taupe hover:text-red-500 transition flex-shrink-0"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* HELPER TEXT */}
              {field.helpText && (
                <p className="text-[11px] text-taupe italic mt-1">
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