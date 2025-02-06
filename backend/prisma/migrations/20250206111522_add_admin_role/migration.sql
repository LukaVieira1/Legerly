/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserStore` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserStore` table. All the data in the column will be lost.
  - Changed the type of `role` on the `UserStore` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OWNER', 'MANAGER', 'EMPLOYEE');

-- AlterTable
ALTER TABLE "UserStore" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "Role";
