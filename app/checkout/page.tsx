
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { getCart } from "@/lib/cart";

export default async function CheckoutPage() {

const session = await auth();

if (!session) {
  redirect("/login");
}

const cart = await getCart();

const serializedCart = JSON.parse(
  JSON.stringify(cart)
);

console.dir(cart, { depth: null });

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl font-bold text-[#1F1816] mb-6">Secure Checkout</h1>
       <CheckoutClient
  cart={serializedCart}
/>
      </main>
    </div>
  );
}