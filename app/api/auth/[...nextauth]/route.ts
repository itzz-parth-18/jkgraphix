import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded admin credentials for now
        const adminEmail = "admin@lumierecrafts.com";
        const adminPassword = "admin123";

        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return { id: "1", name: "Workshop Admin", email: adminEmail };
        }
        
        // Agar password galat ho
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login", // Hamara custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };