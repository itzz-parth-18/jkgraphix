import { prisma } from "@/lib/prisma";
import { Mail, Calendar, User } from "lucide-react";

export default async function AdminInquiriesPage() {
  // Database se sari inquiries fetch karna latest pehle
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="p-8 space-y-8 bg-[#F9F6F2] min-h-screen text-[#2C2320]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1816]">Customer Inquiries</h1>
          <p className="text-[#6E625C] text-sm mt-1">Manage messages and queries submitted through the contact page.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-[#EFE8E2] text-sm font-medium">
          Total Messages: <span className="text-[#C89A84] font-bold">{inquiries.length}</span>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#EFE8E2] text-center space-y-3">
          <Mail className="w-10 h-10 text-[#C89A84] mx-auto opacity-50" />
          <h3 className="font-serif text-xl font-bold text-[#1F1816]">No Inquiries Yet</h3>
          <p className="text-[#6E625C] text-sm">When customers fill out the contact form, their messages will appear right here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {inquiries.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-[#EFE8E2] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE8E2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F9F6F2] text-[#C89A84] flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1816] text-lg">{item.name}</h3>
                    <a href={`mailto:${item.email}`} className="text-sm text-[#C89A84] hover:underline">
                      {item.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6E625C] bg-[#F9F6F2] px-3 py-1.5 rounded-lg w-fit">
                  <Calendar className="w-3.5 h-3.5 text-[#C89A84]" />
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E625C]">Message:</span>
                <p className="text-[#2C2320] bg-[#F9F6F2]/50 p-4 rounded-xl border border-[#EFE8E2] text-sm leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}