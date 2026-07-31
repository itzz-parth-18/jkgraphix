"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // NextAuth ka asli login function
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
        <Image
        src="/images/logo.jpeg"
        alt="JK Graphix"
        width={90}
       height={90}
        priority
        className="rounded-xl object-contain"
       />
    </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-espresso">
          Workshop Access
        </h2>
        <p className="mt-2 text-center text-sm text-taupe">
          Secure area for artisans & admins only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-taupe-border/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Error Message UI */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-espresso">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-taupe-border rounded-lg shadow-sm focus:outline-none focus:ring-rose focus:border-rose sm:text-sm bg-cream"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-espresso">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-taupe-border rounded-lg shadow-sm focus:outline-none focus:ring-rose focus:border-rose sm:text-sm bg-cream"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-cream bg-espresso hover:bg-espresso-hover focus:outline-none transition-colors disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Sign in to Workshop"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-medium text-rose hover:text-espresso transition-colors">
              &larr; Return to Public Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}