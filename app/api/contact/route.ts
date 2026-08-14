import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

type RateLimitRecord = {
  count: number;
  windowStart: number;
};

const contactRateLimits = new Map<string, RateLimitRecord>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = contactRateLimits.get(ip);

  if (!record) {
    return false;
  }

  if (now - record.windowStart >= WINDOW_MS) {
    contactRateLimits.delete(ip);
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const record = contactRateLimits.get(ip);

  if (!record || now - record.windowStart >= WINDOW_MS) {
    contactRateLimits.set(ip, {
      count: 1,
      windowStart: now,
    });
    return;
  }

  record.count += 1;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!name || !email || !message) {
      recordAttempt(ip);

      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      recordAttempt(ip);

      return NextResponse.json(
        { error: "Name is too long." },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      recordAttempt(ip);

      return NextResponse.json(
        { error: "Email address is too long." },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      recordAttempt(ip);

      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      recordAttempt(ip);

      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    await prisma.contactInquiry.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to save contact inquiry:",
      error
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}