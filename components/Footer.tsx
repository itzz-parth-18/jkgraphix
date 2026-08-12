import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1F1816] text-[#F9F6F2] border-t border-[#322724] pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-[#322724]/60">
          
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-[#C89A84] text-[#1F1816] flex items-center justify-center font-serif font-bold text-sm shadow-md">
                JK
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#C89A84] transition-colors">
                JK Graphix
              </span>
            </Link>
            <p className="text-sm text-[#A3958E] leading-relaxed max-w-sm">
              Custom Perfection, Tailored to Your Vision. Premium personalized heirlooms and custom keepsakes designed to last generations.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold tracking-wide text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">Shop</Link></li>
              <li><Link href="/about" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold tracking-wide text-white">Customer Support</h3>
            <ul className="space-y-3 text-sm">
              {/* YAHA LINKS THEEK KAR DIYE GAYE HAIN */}
              <li><Link href="/shipping" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">Refund Policy</Link></li>
              <li><Link href="/privacy" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#A3958E] hover:text-[#C89A84] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold tracking-wide text-white">Connect</h3>
            <div className="flex flex-col space-y-3 text-sm">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#A3958E] hover:text-[#C89A84] transition-colors">
                <span className="w-4 h-4 text-[#C89A84] font-bold">IG</span>
                <span>Instagram</span>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#A3958E] hover:text-[#C89A84] transition-colors">
                <span className="w-4 h-4 text-[#C89A84] font-bold">WA</span>
                <span>WhatsApp</span>
              </a>
              <a href="mailto:support@jkgraphix.com" className="flex items-center gap-3 text-[#A3958E] hover:text-[#C89A84] transition-colors">
                <span className="w-4 h-4 text-[#C89A84] font-bold">@</span>
                <span>Email Support</span>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3958E]">
          <p>© 2026 JK Graphix. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-[#C89A84] fill-[#C89A84]" /> for creating unforgettable memories.
          </p>
        </div>
      </div>
    </footer>
  );
}