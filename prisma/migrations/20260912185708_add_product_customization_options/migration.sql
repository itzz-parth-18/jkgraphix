-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "allowMultiplePhotos" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "photoMaxCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "photoMinCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requiresAdditionalNotes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresCustomMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresCustomName" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresDeliveryDate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresPhoto" BOOLEAN NOT NULL DEFAULT false;
