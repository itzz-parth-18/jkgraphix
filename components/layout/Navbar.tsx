import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import CartSync from "@/components/CartSync"; // Client component for syncing pending cart

export default async function Navbar() {
  const session = await auth();
  
  return (
    <nav className="sticky top-0 z-40 border-b border-[#EFE8E2] bg-[#F9F6F2]/90 px-6 py-4 backdrop-blur-md">
      {/* Background cart sync utility for un-authenticated to authenticated transition */}
      {session && <CartSync />}

      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 font-serif text-xl font-bold tracking-tight text-[#1F1816]"
        >
          <Image
            src="/images/logo.jpeg"
            alt="JK Graphix"
            width={36}
            height={36}
            className="rounded-md"
            priority
          />
          <span>JK Graphix</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] transition">Home</Link>
          <Link href="/shop" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] transition">Shop</Link>
          <Link href="/about" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] transition">About</Link>
          <Link href="/contact" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] transition">Contact</Link>

          {/* Cart Button */}
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
                className="flex items-center gap-2 text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] transition"
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
              className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}