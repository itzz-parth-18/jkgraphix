"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CustomerLoginPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
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
          Welcome Back
        </h2>

        <p className="mt-2 text-center text-sm text-taupe">
          Sign in to your JK Graphix account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-taupe-border/50 bg-white px-6 py-8 shadow-2xl">

          <button
            onClick={() =>
  signIn("google", {
    callbackUrl,
  })
}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="px-4 text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-taupe-border bg-cream p-3 focus:border-rose focus:outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-taupe-border bg-cream p-3 focus:border-rose focus:outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-espresso py-3 font-medium text-white transition hover:bg-espresso-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Continue with Email"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-taupe">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-rose hover:text-espresso"
            >
              Register
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-rose hover:text-espresso"
            >
              ← Return to Store
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}