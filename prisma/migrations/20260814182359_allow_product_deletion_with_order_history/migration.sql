/*
  Warnings:

  - You are about to alter the column `basePrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ServiceTypeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('QUICK_CUSTOMIZE', 'DESIGN_CONSULTATION');

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSeasonal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productType" "ProductType" NOT NULL DEFAULT 'QUICK_CUSTOMIZE',
ADD COLUMN     "showOnHomepage" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "basePrice" SET DEFAULT 0,
ALTER COLUMN "basePrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sku" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceTypeId" TEXT,
    "type" "ProductType" NOT NULL DEFAULT 'QUICK_CUSTOMIZE',

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "status" "ServiceTypeStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceType_name_key" ON "ServiceType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceType_slug_key" ON "ServiceType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
