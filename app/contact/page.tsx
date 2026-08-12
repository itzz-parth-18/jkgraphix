import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with JK Graphix for custom printing, personalized keepsakes, and business design inquiries.",
  openGraph: {
    title: "Contact Us | JK Graphix",
    description: "Get in touch with JK Graphix for custom printing, personalized keepsakes, and business design inquiries.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}