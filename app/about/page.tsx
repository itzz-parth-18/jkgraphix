import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <nav className="sticky top-0 z-40 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#EFE8E2] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#1F1816] flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#1F1816] text-[#F9F6F2] flex items-center justify-center font-serif font-bold text-xs">JK</div>
            <span>JK Graphix</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </nav>
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <h1 className="font-serif text-4xl font-bold text-[#1F1816]">About Our Workshop</h1>
        <p className="text-[#6E625C] text-lg leading-relaxed">
          At JK Graphix, we believe every memory deserves to be preserved in an heirloom. Crafting memories, one gift at a time.
        </p>
      </main>
    </div>
  );
}