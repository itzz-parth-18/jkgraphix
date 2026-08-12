import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const session = await auth();

  // Security Check
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Database se sirf "CUSTOMER" role wale users nikalna, 
  // aur sath mein unka sabse latest order bhi lana taaki missing phone number mil sake.
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { 
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 1, // Sirf sabse latest order lao
        select: { customerPhone: true } // Us order ka sirf phone number lao
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-espresso">
        Customers
      </h1>

      <div className="overflow-x-auto rounded-xl border border-taupe-border bg-white shadow-sm">
        <table className="w-full text-left text-sm text-espresso">
          <thead className="border-b border-taupe-border bg-cream-dark uppercase text-taupe">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Total Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe-border">
            {customers.map((customer: any) => {
              
              // SMART FALLBACK LOGIC: 
              // Pehle User profile ka phone check karo, warna latest order se utha lo.
              const latestOrderPhone = customer.orders?.[0]?.customerPhone;
              const displayPhone = customer.phone || latestOrderPhone || 'N/A';

              return (
                <tr key={customer.id} className="hover:bg-cream-dark/50 transition-colors">
                  <td className="px-6 py-4">{customer.name || 'N/A'}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{displayPhone}</td>
                  <td className="px-6 py-4 font-bold">{customer._count.orders}</td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-taupe">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}