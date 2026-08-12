import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { ShoppingBag, User, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  robots: { index: false, follow: false },
};

export default async function CustomerDashboardPage() {
  const session = await auth();

  const cards = [
    {
      title: "My Orders",
      description: "View your previous orders and track status.",
      icon: ShoppingBag,
      href: "/customer/orders",
    },
    {
      title: "Profile",
      description: "Manage your personal information.",
      icon: User,
      href: "/customer/profile",
    },
    {
      title: "Settings",
      description: "Account preferences and security.",
      icon: Settings,
      href: "/customer/settings",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-3xl border border-[#EFE8E2] shadow-sm">
        <h1 className="text-4xl font-serif font-bold text-[#1F1816]">
          Welcome back, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-[#6E625C] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {session?.user?.email}
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group flex flex-col justify-between rounded-3xl border border-[#EFE8E2] bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-[#C89A84] hover:-translate-y-1"
          >
            <div>
              <div className="mb-4 inline-flex p-3 rounded-2xl bg-[#F9F6F2] text-[#1F1816] group-hover:bg-[#C89A84] group-hover:text-white transition">
                <card.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-[#1F1816]">{card.title}</h2>
              <p className="mt-2 text-sm text-[#6E625C]">{card.description}</p>
            </div>
            <div className="mt-6 flex items-center text-sm font-medium text-[#C89A84] group-hover:text-[#1F1816]">
              View Details <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}