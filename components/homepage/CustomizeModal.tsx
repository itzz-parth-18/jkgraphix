"use client";

import { X, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CustomizeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#F9F6F2] p-5 shadow-2xl animate-in fade-in zoom-in duration-200 sm:rounded-3xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close customization options"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="space-y-5 pt-2 text-center sm:space-y-6 sm:pt-0">
          {/* Heading */}
          <div className="px-7 sm:px-8">
            <h2 className="font-serif text-2xl font-bold leading-tight text-[#1F1816] sm:text-3xl">
              How would you like to proceed?
            </h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {/* Quick Customization Path */}
            <Link
              href="/shop?type=qc"
              onClick={onClose}
              className="group rounded-xl border border-[#EFE8E2] bg-white p-4 text-left transition-all hover:border-[#C89A84] sm:rounded-2xl sm:p-6"
            >
              <Zap className="h-6 w-6 text-[#C89A84] sm:h-8 sm:w-8" />

              <h3 className="mt-3 font-bold text-[#1F1816] sm:mt-4">
                Quick Customization
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#6E625C] sm:text-sm sm:leading-relaxed">
                Fast, simple, and automated. Select a design and checkout
                instantly.
              </p>
            </Link>

            {/* Design Consultation Path */}
            <Link
              href="/shop?type=cr"
              onClick={onClose}
              className="group rounded-xl border border-[#EFE8E2] bg-white p-4 text-left transition-all hover:border-[#1F1816] sm:rounded-2xl sm:p-6"
            >
              <MessageSquare className="h-6 w-6 text-[#1F1816] sm:h-8 sm:w-8" />

              <h3 className="mt-3 font-bold text-[#1F1816] sm:mt-4">
                Design Consultation
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#6E625C] sm:text-sm sm:leading-relaxed">
                Bespoke & highly custom. Collaborate with our artisans.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}