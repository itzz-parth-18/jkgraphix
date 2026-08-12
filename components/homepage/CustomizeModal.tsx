"use client";

import { X, Zap, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CustomizeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#F9F6F2] w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold text-[#1F1816]">How would you like to proceed?</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Quick Customization Path */}
            <Link 
              href="/shop?type=qc" 
              onClick={onClose}
              className="bg-white p-6 rounded-2xl border border-[#EFE8E2] hover:border-[#C89A84] transition-all text-left space-y-3 group"
            >
              <Zap className="w-8 h-8 text-[#C89A84]" />
              <h3 className="font-bold text-[#1F1816]">Quick Customization</h3>
              <p className="text-sm text-[#6E625C]">Fast, simple, and automated. Select a design and checkout instantly.</p>
            </Link>

            {/* Design Consultation Path */}
            <Link 
              href="/shop?type=cr" 
              onClick={onClose}
              className="bg-white p-6 rounded-2xl border border-[#EFE8E2] hover:border-[#1F1816] transition-all text-left space-y-3 group"
            >
              <MessageSquare className="w-8 h-8 text-[#1F1816]" />
              <h3 className="font-bold text-[#1F1816]">Design Consultation</h3>
              <p className="text-sm text-[#6E625C]">Bespoke & highly custom. Collaborate with our artisans.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}