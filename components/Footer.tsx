import Link from "next/link";
import { Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  // Fetch only the settings actually used by the footer.
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ["INSTAGRAM_URL", "WHATSAPP_NUMBER", "SUPPORT_EMAIL"],
      },
    },
    select: {
      key: true,
      value: true,
    },
  });

  // Helper function to find setting safely
  const getSetting = (key: string) =>
    settings.find((s) => s.key === key)?.value;

  const instagramUrl = getSetting("INSTAGRAM_URL") || "https://instagram.com";
  const whatsappNum = getSetting("WHATSAPP_NUMBER") || "917978658304";
  const supportEmail =
    getSetting("SUPPORT_EMAIL") ||
    "support.jkgraphix@gmail.com";

  return (
    <footer className="border-t border-[#322724] bg-[#1F1816] pt-10 pb-8 text-[#F9F6F2] transition-colors duration-300 sm:pt-16 sm:pb-12">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="border-b border-[#322724]/60 pb-8 sm:pb-12 lg:pb-16">

          {/* Brand */}
          <div className="mb-8 space-y-3 sm:mb-10 lg:hidden">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 sm:gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C89A84] font-serif text-sm font-bold text-[#1F1816] shadow-md sm:h-10 sm:w-10">
                JK
              </div>

              <span className="font-serif text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#C89A84] sm:text-2xl">
                JK Graphix
              </span>
            </Link>

            <p className="max-w-sm text-xs leading-5 text-[#A3958E] sm:text-sm sm:leading-relaxed">
              Custom Perfection, Tailored to Your Vision. Premium personalized
              heirlooms and custom keepsakes designed to last generations.
            </p>
          </div>

          {/* Desktop + Mobile Columns */}
          <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0">

            {/* Logo & About — Desktop only */}
            <div className="hidden space-y-4 lg:block lg:pr-12">
              <Link
                href="/"
                className="group inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C89A84] font-serif text-sm font-bold text-[#1F1816] shadow-md">
                  JK
                </div>

                <span className="font-serif text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-[#C89A84]">
                  JK Graphix
                </span>
              </Link>

              <p className="max-w-sm text-sm leading-relaxed text-[#A3958E]">
                Custom Perfection, Tailored to Your Vision. Premium personalized
                heirlooms and custom keepsakes designed to last generations.
              </p>
            </div>

            {/* Quick Links */}
            <div className="min-w-0 space-y-3 lg:px-8">
              <h3 className="font-serif text-[13px] font-semibold leading-4 tracking-wide text-white sm:text-lg sm:leading-5">
                Quick Links
              </h3>

              <ul className="space-y-2 text-[12px] leading-5 sm:space-y-3 sm:text-sm">
                <li>
                  <Link
                    href="/shop"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    Shop
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    Contact
                  </Link>
                </li>

                <li>
                  <Link
                    href="/faq"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Support */}
            <div className="min-w-0 space-y-3 lg:px-8">
              <h3 className="font-serif text-[13px] font-semibold leading-4 tracking-wide text-white sm:text-lg sm:leading-5">
                Customer Support
              </h3>

              <ul className="space-y-2 text-[12px] leading-5 sm:space-y-3 sm:text-sm">
                <li>
                  <Link
                    href="/shipping"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    Shipping Policy
                  </Link>
                </li>

                <li>
                  <Link
                    href="/refund"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    Refund Policy
                  </Link>
                </li>

                <li>
                  <Link
                    href="/privacy"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms"
                    className="text-[#A3958E] transition-colors hover:text-[#C89A84]"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="min-w-0 space-y-3 lg:px-8">
              <h3 className="font-serif text-[13px] font-semibold leading-4 tracking-wide text-white sm:text-lg sm:leading-5">
                Connect
              </h3>

              <div className="flex flex-col gap-2.5 text-[12px] leading-5 sm:gap-3 sm:text-sm">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A3958E] transition-colors hover:text-[#C89A84]"
                >
                  <span className="shrink-0 font-bold text-[#C89A84]">
                    IG
                  </span>
                  <span className="whitespace-nowrap">Instagram</span>
                </a>

                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A3958E] transition-colors hover:text-[#C89A84]"
                >
                  <span className="shrink-0 font-bold text-[#C89A84]">
                    WA
                  </span>
                  <span className="whitespace-nowrap">WhatsApp</span>
                </a>

                <a
                  href={`mailto:${supportEmail}`}
                  className="flex items-center gap-2 text-[#A3958E] transition-colors hover:text-[#C89A84]"
                >
                  <span className="shrink-0 font-bold text-[#C89A84]">
                    @
                  </span>
                  <span className="whitespace-nowrap">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-2.5 pt-5 text-center text-[10px] leading-4 text-[#A3958E] sm:flex-row sm:gap-4 sm:pt-8 sm:text-xs sm:text-left">
          <p>© 2026 JK Graphix. All Rights Reserved.</p>

          <p className="flex items-center justify-center gap-1.5">
            <span>Designed with</span>

            <Heart className="h-3.5 w-3.5 shrink-0 fill-[#C89A84] text-[#C89A84]" />

            <span>for creating unforgettable memories.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}