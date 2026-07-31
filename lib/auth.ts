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
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  }),
    
    Credentials({
      name: "Admin Login",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email as string,
    },
  });

  if (!user || !user.password) {
    return null;
  }

  const validPassword = await bcrypt.compare(
    credentials.password as string,
    user.password
  );

  if (!validPassword) {
    return null;
  }

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
      token.role = user.role;
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as "ADMIN" | "CUSTOMER";
    }

    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
});