import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function WhatsAppFloat() {
  let whatsappNumber = "919999999999"; // Fallback
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "WHATSAPP_NUMBER" },
    });
    if (setting?.value) {
      whatsappNumber = setting.value.trim();
    }
  } catch (error) {
    console.error("Failed to fetch WhatsApp number", error);
  }

  const MESSAGE = "Hi JK Graphix, I need some help with my custom gift!";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 hover:bg-[#1ebd5a]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}