import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import * as bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/account/login",
    error: "/account/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Staff Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const staff = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { permissions: true },
        });

        if (!staff || !staff.isActive) return null;

        const isValid = await bcrypt.compare(credentials.password, staff.passwordHash);
        if (!isValid) return null;

        return {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          isStaff: true,
        };
      },
    }),
    CredentialsProvider({
      id: "customer-credentials",
      name: "Customer Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const customer = await prisma.customer.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!customer || !customer.passwordHash || customer.isBlocked) return null;

        const isValid = await bcrypt.compare(credentials.password, customer.passwordHash);
        if (!isValid) return null;

        return {
          id: customer.id,
          name: customer.name || customer.email.split("@")[0],
          email: customer.email,
          isStaff: false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isStaff = (user as any).isStaff;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).isStaff = token.isStaff;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "krickscricket-secure-fallback-development-secret-2026",
};

