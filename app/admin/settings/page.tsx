import { Save, Store, CreditCard, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  // Security Check
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Database se current settings fetch karna
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string) => settings.find((s: any) => s.key === key)?.value || "";
  
  // Form submit hone par save karne ka Server Action
  async function saveSettings(formData: FormData) {
    "use server";
    
    // Naye keys jo hum database mein save karenge (WhatsApp Number included)
    const keys = ["STORE_NAME", "SUPPORT_EMAIL", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "WHATSAPP_NUMBER"];
    
    for (const key of keys) {
      const value = formData.get(key) as string;
      if (value !== null) {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        });
      }
    }
    revalidatePath("/admin/settings"); // Page ko refresh/update karna
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-espresso">Store Settings</h1>
        <p className="text-sm text-taupe mt-1">Configure your workshop details, WhatsApp support, and payment methods.</p>
      </div>

      <form action={saveSettings} className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-white border border-taupe-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4 border-b border-taupe-border/50 pb-4">
            <Store className="w-5 h-5 text-rose" />
            <h2 className="text-lg font-serif font-semibold text-espresso">General Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Store Name</label>
              <input 
                type="text" 
                name="STORE_NAME" 
                defaultValue={getSetting("STORE_NAME") || "JK Graphix"} 
                className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Support Email</label>
              <input 
                type="email" 
                name="SUPPORT_EMAIL" 
                defaultValue={getSetting("SUPPORT_EMAIL") || "support@jkgraphix.com"} 
                className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" 
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Support Settings */}
        <div className="bg-white border border-taupe-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4 border-b border-taupe-border/50 pb-4">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-serif font-semibold text-espresso">WhatsApp Support</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-1">WhatsApp Number (with country code)</label>
            <input 
              type="text" 
              name="WHATSAPP_NUMBER" 
              defaultValue={getSetting("WHATSAPP_NUMBER") || "919999999999"} 
              placeholder="919876543210"
              className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" 
            />
            <p className="text-xs text-taupe mt-1">This number will be used for the floating WhatsApp button and consultation redirects.</p>
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
              <input 
                type="password" 
                name="RAZORPAY_KEY_ID" 
                defaultValue={getSetting("RAZORPAY_KEY_ID")} 
                placeholder="rzp_test_..." 
                className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Razorpay Key Secret</label>
              <input 
                type="password" 
                name="RAZORPAY_KEY_SECRET" 
                defaultValue={getSetting("RAZORPAY_KEY_SECRET")} 
                placeholder="••••••••••••••••" 
                className="w-full px-3 py-2 border border-taupe-border rounded-lg focus:outline-none focus:border-rose text-sm bg-cream" 
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="flex items-center gap-2 bg-espresso text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-espresso-hover transition shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}