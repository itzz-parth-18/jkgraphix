-- AlterTable
ALTER TABLE "Order" ADD COLUMN "adminDeletedAt" TIMESTAMP(3),
ADD COLUMN "adminDeletedById" TEXT,
ADD COLUMN "customerDeletedAt" TIMESTAMP(3);
