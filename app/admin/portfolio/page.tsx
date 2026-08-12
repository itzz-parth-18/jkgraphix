import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Briefcase, Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="p-8 space-y-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Portfolio Management</h1>
          <p className="text-[#6E625C] text-sm mt-1">Manage showcase items displayed on the public portfolio page.</p>
        </div>
        <Link 
          href="/admin/portfolio/new" 
          className="flex items-center gap-2 bg-[#1F1816] text-white px-5 py-2.5 rounded-xl hover:bg-[#C89A84] transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Portfolio Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#EFE8E2] text-center space-y-3">
          <Briefcase className="w-10 h-10 text-[#C89A84] mx-auto opacity-50" />
          <h3 className="font-serif text-xl font-bold text-[#1F1816]">No Portfolio Items</h3>
          <p className="text-[#6E625C] text-sm">Click the button above to add your first showcase project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#EFE8E2] overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full bg-[#F9F6F2]">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${item.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {item.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-xs font-semibold text-[#C89A84] uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-serif text-lg font-bold text-[#1F1816]">{item.title}</h3>
                  {item.description && <p className="text-[#6E625C] text-xs line-clamp-2">{item.description}</p>}
                </div>
              </div>
              
              <div className="p-5 pt-0 flex items-center justify-between border-t border-[#EFE8E2] mt-4">
                <Link href={`/admin/portfolio/${item.id}/edit`} className="text-xs font-bold text-[#1F1816] hover:text-[#C89A84]">
                  Edit Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}