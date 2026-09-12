import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, LogOut, User, Menu } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import CartSync from "@/components/CartSync";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-40 border-b border-[#EFE8E2] bg-[#F9F6F2]/95 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
      {/* Background cart sync utility */}
      {session && <CartSync />}

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 font-serif text-lg font-bold tracking-tight text-[#1F1816] sm:gap-3 sm:text-xl"
        >
          <Image
            src="/images/logo.jpeg"
            alt="JK Graphix"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-md"
            priority
          />

          <span className="leading-none">
            JK Graphix
          </span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-5 md:flex lg:gap-6">
          <Link
            href="/"
            className="text-xs font-semibold text-[#2C2320] transition hover:text-[#C89A84]"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-xs font-semibold text-[#2C2320] transition hover:text-[#C89A84]"
          >
            Shop
          </Link>

          <Link
            href="/about"
            className="text-xs font-semibold text-[#2C2320] transition hover:text-[#C89A84]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-xs font-semibold text-[#2C2320] transition hover:text-[#C89A84]"
          >
            Contact
          </Link>

          {/* Desktop Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-lg bg-[#1F1816] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#322724]"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Link>

          {session ? (
            <>
              <Link
                href="/customer"
                className="flex items-center gap-2 text-xs font-semibold text-[#2C2320] transition hover:text-[#C89A84]"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold text-[#2C2320] transition hover:text-[#C89A84]"
            >
              Login
            </Link>
          )}
        </div>

        {/* ================= MOBILE NAV ================= */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#1F1816] px-3 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
          </Link>

          {/* Mobile Menu */}
          <details className="relative">
            <summary
              aria-label="Open navigation menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-[#E2DDD9] bg-white text-[#1F1816] shadow-sm transition active:scale-[0.98] [&::-webkit-details-marker]:hidden"
            >
              <Menu className="h-5 w-5" />
            </summary>

            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-[#E2DDD9] bg-[#FDFBF7] p-2 shadow-xl">
              <div className="flex flex-col">
                <Link
                  href="/"
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-[#2C2320] transition hover:bg-[#EFE8E2]"
                >
                  Home
                </Link>

                <Link
                  href="/shop"
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-[#2C2320] transition hover:bg-[#EFE8E2]"
                >
                  Shop
                </Link>

                <Link
                  href="/about"
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-[#2C2320] transition hover:bg-[#EFE8E2]"
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-[#2C2320] transition hover:bg-[#EFE8E2]"
                >
                  Contact
                </Link>

                <div className="my-1 border-t border-[#E2DDD9]" />

                {session ? (
                  <>
                    <Link
                      href="/customer"
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#2C2320] transition hover:bg-[#EFE8E2]"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>

                    <form
                      action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                      }}
                    >
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-[#2C2320] transition hover:bg-[#EFE8E2]"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}