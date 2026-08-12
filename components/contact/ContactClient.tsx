"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactClient() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        setSuccess(true);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2C2320] flex flex-col">
      <nav className="sticky top-0 z-40 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#EFE8E2] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#1F1816] flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#1F1816] text-[#F9F6F2] flex items-center justify-center font-serif font-bold text-xs">JK</div>
            <span>JK Graphix</span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-[#2C2320] hover:text-[#C89A84] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </nav>
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text & Info */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="font-serif text-5xl font-bold text-[#1F1816] leading-tight">
                Celebrate Your <br className="hidden md:block" /> Special Moments
              </h1>
              <p className="text-[#6E625C] text-lg leading-relaxed max-w-md">
                Connect with us to create unforgettable gifts that celebrate your milestones and bring joy to your loved ones. Let's make memories together!
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-[#1F1816] text-lg mb-1">Phone Number</h3>
                <p className="text-[#6E625C]">Support line available via workshop hours.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#1F1816] text-lg mb-1">E-Mail</h3>
                <p className="text-[#6E625C]">support@jkgraphix.com</p>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#EFE8E2] shadow-sm">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                <div className="w-20 h-20 bg-[#F9F6F2] text-[#C89A84] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl font-bold text-[#1F1816]">Message Sent!</h2>
                  <p className="text-[#6E625C]">Thank you for reaching out. Our artisan team has received your message.</p>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-3 bg-[#1F1816] text-white rounded-xl hover:bg-[#C89A84] transition-colors font-medium cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-3xl font-bold text-[#1F1816] text-center md:text-left mb-8">
                  Fill The Form
                </h2>

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-bold text-[#1F1816]">
                    Your First Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Enter your first name" 
                    className="w-full px-5 py-3.5 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 focus:outline-none focus:border-[#C89A84] transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-[#1F1816]">
                    Your Email Address*
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="Enter your email address" 
                    className="w-full px-5 py-3.5 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 focus:outline-none focus:border-[#C89A84] transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-bold text-[#1F1816]">
                    Your Message*
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    rows={4} 
                    placeholder="Type your message here" 
                    className="w-full px-5 py-3.5 rounded-xl border border-[#EFE8E2] bg-[#F9F6F2]/50 focus:outline-none focus:border-[#C89A84] transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-[#1F1816] text-white font-medium py-4 rounded-xl hover:bg-[#C89A84] transition-colors mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Your Inquiry"}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}