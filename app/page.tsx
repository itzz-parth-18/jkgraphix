

import React from "react";
import Link from "next/link";
import { 
  Gift, ArrowRight, ShieldCheck, Truck, ShoppingCart, 
  Star, Camera, PenTool, Heart, Quote 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  // Custom Instagram Icon SVG
  const InstagramIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      {/* 1. Top Brand Navigation Bar */}
      <Navbar />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden bg-[#EFE8E2]/60 border-b border-[#EFE8E2] py-16 lg:py-24 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-[#C89A84]/15 text-[#1F1816] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                <SparklesIconCustom className="w-3.5 h-3.5 text-[#C89A84]" /> Custom Perfection, Tailored To Your Vision
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-[#1F1816]">
                Gifts engraved with <span className="italic text-[#C89A84]">their story</span>, not just their name.
              </h1>
              <p className="text-[#6E625C] text-base sm:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                Transform cherished dates, handwritten notes, and unforgettable photos into timeless heirloom keepsake memory boxes and custom gifts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/shop/custom-memory-box" className="w-full sm:w-auto bg-[#1F1816] hover:bg-[#322724] text-white px-8 py-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]">
                  Customize Your Gift <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/shop" className="w-full sm:w-auto bg-transparent border-2 border-[#C89A84] text-[#1F1816] hover:bg-[#EFE8E2] px-8 py-4 rounded-xl text-sm font-medium flex items-center justify-center transition-all">
                  Browse Collection
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-[#C89A84]/30">
                <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop" alt="Handcrafted Custom Gift Memory Box" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#FFFFFF]/95 backdrop-blur-md p-4 rounded-xl border border-[#EFE8E2] flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-serif text-sm font-semibold text-[#1F1816]">Walnut Memory Box</p>
                    <p className="text-xs text-[#6E625C]">Custom gold leaf engraving</p>
                  </div>
                  <span className="font-serif font-medium italic text-sm text-[#C89A84]">Made Just For You</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Categories */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-[#1F1816]">Shop by Category</h2>
            <p className="text-[#6E625C] mt-3 text-sm">Discover our handcrafted collections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Memory Boxes', 'Keepsake Jewelry', 'Custom Engravings'].map((category, i) => (
              <Link key={i} href="/shop" className="group relative h-64 rounded-2xl overflow-hidden border border-[#EFE8E2]">
                <div className="absolute inset-0 bg-[#1F1816]/20 group-hover:bg-[#1F1816]/10 transition-colors z-10" />
                <img src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop&sig=${i}`} alt={category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <h3 className="text-white text-xl font-serif font-bold tracking-wide drop-shadow-md">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Best Sellers */}
        <section className="py-20 bg-[#EFE8E2]/30 border-y border-[#EFE8E2] px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#1F1816]">Best Sellers</h2>
                <p className="text-[#6E625C] mt-3 text-sm">Our most loved personalized pieces</p>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#C89A84] hover:text-[#1F1816] transition">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#EFE8E2] shadow-sm group">
                  <div className="aspect-square relative overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop&sig=${item+10}`} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif font-semibold text-[#1F1816] text-sm">Personalized Keepsake {item}</h4>
                    <p className="text-[#C89A84] text-xs font-medium mt-2 italic">Made Just For You</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#1F1816]">How It Works</h2>
            <p className="text-[#6E625C] mt-3 text-sm">Your unique story, beautifully crafted in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-[#EFE8E2] rounded-full flex items-center justify-center border border-[#C89A84]/40">
                <Camera className="w-7 h-7 text-[#C89A84]" />
              </div>
              <h3 className="font-serif font-semibold text-[#1F1816]">1. Share Your Memory</h3>
              <p className="text-sm text-[#6E625C]">Upload a cherished photo, handwritten note, or a special date.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-[#EFE8E2] rounded-full flex items-center justify-center border border-[#C89A84]/40">
                <PenTool className="w-7 h-7 text-[#C89A84]" />
              </div>
              <h3 className="font-serif font-semibold text-[#1F1816]">2. Personalize It</h3>
              <p className="text-sm text-[#6E625C]">Choose your material, engraving style, and real-time preview.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-[#EFE8E2] rounded-full flex items-center justify-center border border-[#C89A84]/40">
                <Heart className="w-7 h-7 text-[#C89A84]" />
              </div>
              <h3 className="font-serif font-semibold text-[#1F1816]">3. Handcrafted with Care</h3>
              <p className="text-sm text-[#6E625C]">Our artisans carefully engrave and ship your custom heirloom.</p>
            </div>
          </div>
        </section>

        {/* 6. Why Choose Us */}
        <section className="py-16 bg-[#FFFFFF] border-y border-[#EFE8E2] px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-[#1F1816]">Why Choose JK Graphix</h2>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-[#EFE8E2] rounded-xl">
                <Gift className="w-6 h-6 text-[#C89A84]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1F1816]">Live Real-Time Preview</h4>
                <p className="text-xs text-[#6E625C] mt-0.5">Instant photo & text previews before ordering</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-[#EFE8E2] rounded-xl">
                <Truck className="w-6 h-6 text-[#C89A84]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1F1816]">Fast Workshop Dispatch</h4>
                <p className="text-xs text-[#6E625C] mt-0.5">Handcrafted & shipped in 2–3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-[#EFE8E2] rounded-xl">
                <ShieldCheck className="w-6 h-6 text-[#C89A84]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1F1816]">Artisan Guarantee</h4>
                <p className="text-xs text-[#6E625C] mt-0.5">100% satisfaction on engraving precision</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-[#1F1816]">Stories of Joy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-[#EFE8E2]/30 p-8 rounded-2xl border border-[#EFE8E2] relative">
                <Quote className="w-8 h-8 text-[#C89A84]/20 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4 text-[#C89A84]">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-[#1F1816] font-medium italic mb-6 leading-relaxed">
                  "Absolutely stunning craftsmanship! The engraving of my grandfather's handwriting made me tear up. A true heirloom."
                </p>
                <p className="text-xs font-bold text-[#6E625C] uppercase tracking-wider">— Sarah Jenkins</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Instagram Gallery */}
        <section className="py-20 bg-[#EFE8E2]/20 border-t border-[#EFE8E2] px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center">
              <InstagramIcon className="w-8 h-8 text-[#C89A84] mb-4" />
              <h2 className="text-3xl font-serif font-bold text-[#1F1816]">Follow Our Workshop</h2>
              <p className="text-[#6E625C] mt-3 text-sm">@jkgraphix</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square bg-[#EFE8E2] rounded-xl overflow-hidden relative group cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop&sig=${item+20}`} alt="Instagram Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#1F1816]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <InstagramIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-[#1F1816] text-[#F9F6F2] py-12 px-6 border-t border-[#322724]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-serif text-xl font-bold flex items-center gap-2 mb-4 text-white">
              <img src="/images/logo.jpeg" alt="JK Graphix Logo" className="h-7 w-7 object-contain rounded bg-white p-0.5" /> JK Graphix
            </Link>
            <p className="text-sm text-[#F9F6F2]/70 max-w-sm">Custom Perfection, Tailored To Your Vision. Premium personalized keepsakes, designed to tell your unique story.</p>
          </div>
          <div>
            <h4 className="font-serif font-semibold mb-4 text-[#C89A84]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#F9F6F2]/70">
              <li><Link href="/shop" className="hover:text-white transition">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-white transition">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold mb-4 text-[#C89A84]">Support</h4>
            <ul className="space-y-2 text-sm text-[#F9F6F2]/70">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[#F9F6F2]/10 text-center text-xs text-[#F9F6F2]/50">
          <p>© {new Date().getFullYear()} JK Graphix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Sparkles helper component
function SparklesIconCustom({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}