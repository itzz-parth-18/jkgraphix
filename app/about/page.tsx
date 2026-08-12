import Link from "next/link";
import { ArrowLeft, Camera, Sparkles, Gift, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | JK Graphix",
  description: "Learn about JK Graphix's journey in crafting personalized memories and custom keepsakes with precision and passion.",
  openGraph: {
    title: "About Us | JK Graphix",
    description: "Learn about JK Graphix's journey in crafting personalized memories and custom keepsakes with precision and passion.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#EFE8E2] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#1F1816] flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#1F1816] text-[#F9F6F2] flex items-center justify-center font-serif font-bold text-xs">JK</div>
            <span>JK Graphix</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </nav>
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-16 space-y-20">
        
        {/* 1. Hero Banner */}
        <div className="text-center space-y-4 py-12 px-6 bg-white rounded-3xl border border-[#EFE8E2] shadow-sm">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F1816] tracking-tight">
            Custom Perfection, Tailored to Your Vision
          </h1>
          <p className="text-[#6E625C] text-lg max-w-2xl mx-auto leading-relaxed">
            We believe every celebration deserves a personal touch. Welcome to JK Graphix, where your favorite moments become unforgettable keepsakes.
          </p>
        </div>

        {/* 2. Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-[#1F1816] text-[#F9F6F2] p-8 md:p-12 rounded-3xl shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Sparkles className="w-48 h-48 text-[#C89A84]" />
            </div>
            <span className="text-[#C89A84] text-xs font-bold uppercase tracking-widest">Our Heritage</span>
            <h2 className="font-serif text-3xl font-bold">Built on Passion & Precision</h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              JK Graphix was born out of a simple idea: gifting shouldn't be stressful, and it shouldn't be generic. Founded with an eye for meticulous detail, we approach every customized gift like a precision project.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-[#1F1816]">Our Story</h2>
            <p className="text-[#6E625C] leading-relaxed">
              We know that when you order a custom photo frame, an engraved keepsake, or a curated hamper, you are trusting us with your most precious memories. That’s why we obsess over the quality of our materials, the exactness of our prints, and the care in our packaging.
            </p>
            <p className="text-[#6E625C] leading-relaxed">
              We are here to help you deliver happiness, right to their doorstep.
            </p>
          </div>
        </div>

        {/* 3. Three Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#C89A84] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F6F2] text-[#C89A84] flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F1816]">The Photo Collection</h3>
              <p className="text-[#6E625C] text-sm leading-relaxed">
                Transform your camera roll into tangible joy. From custom frames to polaroids, we turn your favorite snapshots into everyday reminders of the people you love.
              </p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#1F1816] hover:text-[#C89A84] flex items-center gap-1 pt-4">
              Shop Photo Gifts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#C89A84] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F6F2] text-[#C89A84] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F1816]">Engraved Keepsakes</h3>
              <p className="text-[#6E625C] text-sm leading-relaxed">
                Some messages are meant to last forever. Our beautifully crafted, precision-engraved items add a touch of timeless elegance to any milestone.
              </p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#1F1816] hover:text-[#C89A84] flex items-center gap-1 pt-4">
              Shop Engraved Gifts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#C89A84] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F6F2] text-[#C89A84] flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F1816]">Curated Custom Sets</h3>
              <p className="text-[#6E625C] text-sm leading-relaxed">
                Want to make a massive impact? Let us do the heavy lifting. Our fully personalized hampers are engineered to create the ultimate unboxing experience.
              </p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#1F1816] hover:text-[#C89A84] flex items-center gap-1 pt-4">
              Shop Hampers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* 4. Bottom Call-to-Action Banner */}
        <div className="bg-[#1F1816] text-white p-12 rounded-3xl text-center space-y-6 shadow-md">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Ready to create something special?</h2>
          <div className="pt-2">
            <Link href="/shop" className="inline-block bg-[#C89A84] text-[#1F1816] px-8 py-4 rounded-xl hover:bg-white transition-colors font-bold shadow-sm">
              Shop Best Sellers
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}