"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong.");
      setLoading(false);
      return;
    }

    setSuccess("Account created successfully! Redirecting...");
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

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
          Create Your Account
        </h2>

        <p className="mt-2 text-center text-sm text-taupe">
          Join JK Graphix and start shopping
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-taupe-border/50 bg-white px-6 py-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                {success}
              </div>
            )}

            <div>
              <input
                className="w-full rounded-lg border border-taupe-border bg-cream p-3 focus:border-rose focus:outline-none"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                className="w-full rounded-lg border border-taupe-border bg-cream p-3 focus:border-rose focus:outline-none"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                className="w-full rounded-lg border border-taupe-border bg-cream p-3 focus:border-rose focus:outline-none"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-espresso py-3 font-medium text-white transition hover:bg-espresso-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-taupe">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-rose hover:text-espresso"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}