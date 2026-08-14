import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 10 * 60 * 1000;

type LoginAttemptRecord = {
  count: number;
  lockedUntil: number | null;
};

const loginAttempts = new Map<string, LoginAttemptRecord>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isLocked(identifier: string) {
  const record = loginAttempts.get(identifier);

  if (!record) {
    return false;
  }

  if (
    record.lockedUntil &&
    record.lockedUntil > Date.now()
  ) {
    return true;
  }

  if (
    record.lockedUntil &&
    record.lockedUntil <= Date.now()
  ) {
    loginAttempts.delete(identifier);
    return false;
  }

  return false;
}

function recordFailedAttempt(identifier: string) {
  const now = Date.now();

  const existing = loginAttempts.get(identifier);

  const count = (existing?.count ?? 0) + 1;

  if (count >= LOGIN_MAX_ATTEMPTS) {
    loginAttempts.set(identifier, {
      count,
      lockedUntil: now + LOGIN_LOCKOUT_MS,
    });

    return;
  }

  loginAttempts.set(identifier, {
    count,
    lockedUntil: null,
  });
}

function clearFailedAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
 
 adapter: PrismaAdapter(prisma),
    providers: [  
    Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  }),
    
    Credentials({
      name: "Admin Login",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, request) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const email = String(credentials.email)
    .trim()
    .toLowerCase();

  const ip = getClientIp(request);

  const accountIdentifier = `account:${email}`;
  const ipIdentifier = `ip:${ip}`;

  if (
    isLocked(accountIdentifier) ||
    isLocked(ipIdentifier)
  ) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.password) {
    recordFailedAttempt(accountIdentifier);
    recordFailedAttempt(ipIdentifier);
    return null;
  }

  const validPassword = await bcrypt.compare(
    String(credentials.password),
    user.password
  );

  if (!validPassword) {
    recordFailedAttempt(accountIdentifier);
    recordFailedAttempt(ipIdentifier);
    return null;
  }

  clearFailedAttempts(accountIdentifier);
  clearFailedAttempts(ipIdentifier);

  return user;
},
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }

    if (token.id) {
      const dbUser = await prisma.user.findUnique({
        where: {
          id: token.id as string,
        },
        select: {
          role: true,
        },
      });

      if (!dbUser) {
        // Invalidate the application's authorization state
        // for a user that no longer exists.
        token.id = "";
        token.role = "CUSTOMER";
      } else {
        token.role = dbUser.role;
      }
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user && token.id) {
      session.user.id = token.id as string;
      session.user.role = token.role as "ADMIN" | "CUSTOMER";
    }

    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
});