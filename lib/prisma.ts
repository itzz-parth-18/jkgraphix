import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// NAYA: Connection timeout aur max connections set kiye hain taaki connection drop na ho
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Maximum connections pool mein limit kiye
  idleTimeoutMillis: 30000, // 30 seconds tak idle rahega toh connection band hoga
  connectionTimeoutMillis: 10000, // 10 seconds mein timeout agar connect na ho
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}