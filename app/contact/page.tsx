import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with JK Graphix for custom printing, personalized keepsakes, and business design inquiries.",
  openGraph: {
    title: "Contact Us | JK Graphix",
    description: "Get in touch with JK Graphix for custom printing, personalized keepsakes, and business design inquiries.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  // Database se dynamic support email aur whatsapp/phone fetch karna
  let supportEmail = "support@jkgraphix.com";
  let whatsappNumber = "919999999999";

  try {
    const settings = await prisma.setting.findMany();

console.log("CONTACT SETTINGS:", settings);

    const emailSetting = settings.find((s) => s.key === "SUPPORT_EMAIL");
    if (emailSetting?.value) supportEmail = emailSetting.value;

    const whatsappSetting = settings.find((s) => s.key === "WHATSAPP_NUMBER");
    if (whatsappSetting?.value) whatsappNumber = whatsappSetting.value;
  } catch (error) {
    console.error("Failed to fetch contact settings", error);
  }

  return (
    <ContactClient 
      supportEmail={supportEmail} 
      whatsappNumber={whatsappNumber} 
    />
  );
}