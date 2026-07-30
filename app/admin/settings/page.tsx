"use client";

import React from "react";
import { Save, Store, CreditCard } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-espresso">Store Settings</h1>
        <p className="text-sm text-taupe mt-1">Configure your workshop details and payment methods.</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white border border-taupe-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4 border-b border-taupe-border/50 pb-4">
            <Store className="w-5 h-5 text-rose" />
            <h2 className="text-lg font-serif font-semibold text-espresso">General Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Store Name</label>
              <input type="text" defaultValue="JK Graphix" className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" />
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Support Email</label>
              <input type="email" defaultValue="support@lumierecrafts.com" className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white border border-taupe-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4 border-b border-taupe-border/50 pb-4">
            <CreditCard className="w-5 h-5 text-rose" />
            <h2 className="text-lg font-serif font-semibold text-espresso">Payment Gateway (Razorpay)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Razorpay Key ID</label>
              <input type="password" placeholder="rzp_test_..." className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" />
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Razorpay Key Secret</label>
              <input type="password" placeholder="••••••••••••••••" className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-espresso text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-espresso-hover transition shadow-sm">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}