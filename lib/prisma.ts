import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const rawUrl = process.env.DATABASE_URL || "";
const cleanUrl = rawUrl.split("?")[0];

const pool = new Pool({
  connectionString: cleanUrl || "postgres://postgres:postgres@localhost:51214/template1",
  ssl: false,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;