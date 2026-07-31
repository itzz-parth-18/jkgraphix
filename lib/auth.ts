import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
 
 adapter: PrismaAdapter(prisma),
    providers: [  
    Google({
     clientId: process.env.GOOGLE_CLIENT_ID!,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
     }),
    
    Credentials({
      name: "Admin Login",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
  const adminEmail = "admin@lumierecrafts.com";
  const adminPassword = "admin123";

  if (
    credentials?.email === adminEmail &&
    credentials?.password === adminPassword
  ) {
    return {
      id: "1",
      name: "Workshop Admin",
      email: adminEmail,
    };
  }

  return null;
},
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});