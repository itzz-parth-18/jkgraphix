import type { Metadata } from "next";
import RegisterClient from "@/components/auth/RegisterClient";

export const metadata: Metadata = {
  title: "Create Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}