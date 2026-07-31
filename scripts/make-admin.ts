import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email.");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(`${email} is now an ADMIN.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });