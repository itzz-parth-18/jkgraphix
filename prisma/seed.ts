import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

// Direct object configuration for PostgreSQL connection
const pool = new Pool({
  host: "localhost",
  port: 51214,
  user: "postgres",
  password: "postgres",
  database: "template1",
  ssl: false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Lumière Crafts database...");

  await prisma.customField.deleteMany();
  await prisma.product.deleteMany();

  const memoryBox = await prisma.product.create({
    data: {
      name: "The Lumière Keepsake Memory Box",
      slug: "lumiere-keepsake-memory-box",
      description:
        "Handcrafted walnut wood memory box featuring custom laser-engraved monogramming.",
      basePrice: 85.00,
      sku: "LUM-MB-001",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800",
      customFields: {
        create: [
          {
            label: "Engraving Monogram / Message",
            fieldType: "SHORT_TEXT",
            isRequired: true,
            placeholder: "e.g., E & A — 10.24.2026",
            sortOrder: 1,
          },
          {
            label: "Inner Lid Personal Note",
            fieldType: "LONG_TEXT",
            isRequired: false,
            placeholder: "Write a special note...",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  console.log("Seeded Product Successfully:", memoryBox.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });