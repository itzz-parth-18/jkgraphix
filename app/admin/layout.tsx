"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page par sidebar nahi dikhana hai
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-cream-dark">
      {/* Sidebar */}
      <div className="w-64 bg-espresso text-cream flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-white/10">
          <Sparkles className="w-5 h-5 text-rose" />
          <span className="font-serif font-bold text-lg">Workshop Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/admin/dashboard" ? "bg-rose text-white" : "hover:bg-white/10"}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/admin/orders" ? "bg-rose text-white" : "hover:bg-white/10"}`}>
            <ShoppingBag className="w-5 h-5" /> Orders
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/admin/products" ? "bg-rose text-white" : "hover:bg-white/10"}`}>
            <Package className="w-5 h-5" /> Products
          </Link>
          <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/admin/settings" ? "bg-rose text-white" : "hover:bg-white/10"}`}>
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
  <button 
    onClick={() => signOut({ callbackUrl: "/admin/login" })}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-taupe transition-colors"
  >
    <LogOut className="w-5 h-5" /> Sign Out
  </button>
</div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-white m-2 rounded-2xl shadow-sm border border-taupe-border">
        {children}
      </div>
    </div>
  );
}