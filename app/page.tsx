"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, Gift, ArrowRight, ShieldCheck, Truck, ShoppingCart, 
  Star, Camera, PenTool, Heart, Quote 
} from "lucide-react";

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
    <div className="min-h-screen bg-cream text-espresso flex flex-col">
      {/* 1. Top Brand Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-taupe-border/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-espresso flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose" /> JK Graphix
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/shop" className="text-xs font-semibold text-espresso hover:text-rose transition">Shop</Link>
            <Link href="/about" className="text-xs font-semibold text-espresso hover:text-rose transition">About</Link>
            <Link href="/contact" className="text-xs font-semibold text-espresso hover:text-rose transition">Contact</Link>
            <Link href="/cart" className="bg-espresso text-cream text-xs font-medium px-4 py-2 rounded-lg hover:bg-espresso-hover transition flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Cart
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden bg-cream-dark/60 border-b border-taupe-border/50 py-16 lg:py-24 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-rose-light text-espresso px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-rose" /> Handcrafted Personalizations
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-espresso">
                Gifts engraved with <span className="italic text-rose">their story</span>, not just their name.
              </h1>
              <p className="text-taupe text-base sm:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                Transform cherished dates, handwritten notes, and unforgettable photos into timeless heirloom keepsake memory boxes and custom gifts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/shop/custom-memory-box" className="w-full sm:w-auto bg-espresso hover:bg-espresso-hover text-cream px-8 py-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]">
                  Customize Your Gift <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/shop" className="w-full sm:w-auto bg-transparent border-2 border-taupe-border/80 text-espresso hover:border-espresso hover:bg-cream-dark px-8 py-4 rounded-xl text-sm font-medium flex items-center justify-center transition-all">
                  Browse Collection
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-taupe-border/80">
                <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop" alt="Handcrafted Custom Gift Memory Box" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 right-4 bg-cream/95 backdrop-blur-md p-4 rounded-xl border border-taupe-border/60 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-sm font-semibold text-espresso">Walnut Memory Box</p>
                    <p className="text-xs text-taupe">Custom gold leaf engraving</p>
                  </div>
                  <span className="font-serif font-medium italic text-sm text-rose">Made Just For You</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Categories */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-espresso">Shop by Category</h2>
            <p className="text-taupe mt-3 text-sm">Discover our handcrafted collections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Memory Boxes', 'Keepsake Jewelry', 'Custom Engravings'].map((category, i) => (
              <Link key={i} href="/shop" className="group relative h-64 rounded-2xl overflow-hidden border border-taupe-border/50">
                <div className="absolute inset-0 bg-espresso/20 group-hover:bg-espresso/10 transition-colors z-10" />
                <img src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop&sig=${i}`} alt={category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <h3 className="text-white text-xl font-serif font-bold tracking-wide drop-shadow-md">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Best Sellers */}
        <section className="py-20 bg-cream-dark/30 border-y border-taupe-border/50 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-espresso">Best Sellers</h2>
                <p className="text-taupe mt-3 text-sm">Our most loved personalized pieces</p>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-medium text-rose hover:text-espresso transition">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-2xl overflow-hidden border border-taupe-border/50 shadow-sm group">
                  <div className="aspect-square relative overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop&sig=${item+10}`} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif font-semibold text-espresso text-sm">Personalized Keepsake {item}</h4>
                    <p className="text-rose text-xs font-medium mt-2 italic">Made Just For You</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-espresso">How It Works</h2>
            <p className="text-taupe mt-3 text-sm">Your unique story, beautifully crafted in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-cream-dark rounded-full flex items-center justify-center border border-taupe-border">
                <Camera className="w-7 h-7 text-rose" />
              </div>
              <h3 className="font-serif font-semibold text-espresso">1. Share Your Memory</h3>
              <p className="text-sm text-taupe">Upload a cherished photo, handwritten note, or a special date.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-cream-dark rounded-full flex items-center justify-center border border-taupe-border">
                <PenTool className="w-7 h-7 text-rose" />
              </div>
              <h3 className="font-serif font-semibold text-espresso">2. Personalize It</h3>
              <p className="text-sm text-taupe">Choose your material, engraving style, and real-time preview.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-cream-dark rounded-full flex items-center justify-center border border-taupe-border">
                <Heart className="w-7 h-7 text-rose" />
              </div>
              <h3 className="font-serif font-semibold text-espresso">3. Handcrafted with Care</h3>
              <p className="text-sm text-taupe">Our artisans carefully engrave and ship your custom heirloom.</p>
            </div>
          </div>
        </section>

        {/* 6. Why Choose Us */}
        <section className="py-16 bg-white border-y border-taupe-border/50 px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-espresso">Why Choose JK Graphix</h2>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-cream-dark rounded-xl">
                <Gift className="w-6 h-6 text-rose" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-espresso">Live Real-Time Preview</h4>
                <p className="text-xs text-taupe mt-0.5">Instant photo & text previews before ordering</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-cream-dark rounded-xl">
                <Truck className="w-6 h-6 text-rose" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-espresso">Fast Workshop Dispatch</h4>
                <p className="text-xs text-taupe mt-0.5">Handcrafted & shipped in 2–3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-cream-dark rounded-xl">
                <ShieldCheck className="w-6 h-6 text-rose" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-espresso">Artisan Guarantee</h4>
                <p className="text-xs text-taupe mt-0.5">100% satisfaction on engraving precision</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-espresso">Stories of Joy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-cream-dark/30 p-8 rounded-2xl border border-taupe-border/50 relative">
                <Quote className="w-8 h-8 text-rose/20 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4 text-rose">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-espresso font-medium italic mb-6 leading-relaxed">
                  "Absolutely stunning craftsmanship! The engraving of my grandfather's handwriting made me tear up. A true heirloom."
                </p>
                <p className="text-xs font-bold text-taupe uppercase tracking-wider">— Sarah Jenkins</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Instagram Gallery */}
        <section className="py-20 bg-cream-dark/20 border-t border-taupe-border/50 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center">
              <InstagramIcon className="w-8 h-8 text-rose mb-4" />
              <h2 className="text-3xl font-serif font-bold text-espresso">Follow Our Workshop</h2>
              <p className="text-taupe mt-3 text-sm">@jkgraphix</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square bg-taupe-border/30 rounded-xl overflow-hidden relative group cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop&sig=${item+20}`} alt="Instagram Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <InstagramIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-espresso text-cream py-12 px-6 border-t border-taupe-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-serif text-xl font-bold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-rose" /> JK Graphix
            </Link>
            <p className="text-sm text-cream/70 max-w-sm">Handcrafted personalized keepsakes, designed to tell your unique story. Made with love in our artisan workshop.</p>
          </div>
          <div>
            <h4 className="font-serif font-semibold mb-4 text-rose">Quick Links</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link href="/shop" className="hover:text-white transition">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-white transition">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold mb-4 text-rose">Support</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-cream/20 text-center text-xs text-cream/50">
          <p>© {new Date().getFullYear()} JK Graphix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}