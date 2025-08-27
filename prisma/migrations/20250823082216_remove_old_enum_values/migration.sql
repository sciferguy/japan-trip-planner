/*
  Warnings:

  - The values [SHOPPING,OTHER] on the enum `ChecklistCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [OTHER] on the enum `ExpenseCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [TRAIN_STATION,AIRPORT] on the enum `PinType` will be removed. If these variants are still used in the database, this will fail.
  - The values [FLIGHT,TRAIN] on the enum `ReservationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN] on the enum `TripMemberRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [EDIT_ITINERARY,MANAGE_RESERVATIONS,MANAGE_EXPENSES,MANAGE_ACTIVITIES,VIEW_ONLY] on the enum `TripPermission` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `completed` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_duration` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_id` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `itinerary_items` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `itinerary_items` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `itinerary_items` table. All the data in the column will be lost.
  - You are about to drop the column `custom_notes` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `google_place_id` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `confirmation_code` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `date_time` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `trip_members` table. All the data in the column will be lost.
  - Added the required column `name` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount_jpy` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount_original` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_user_id` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_original` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fx_rate` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_user_id` to the `itinerary_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_id` to the `itinerary_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ItemStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ChecklistCategory_new" AS ENUM ('DOCUMENTS', 'PACKING', 'BOOKING', 'PREPARATION', 'GENERAL');
ALTER TABLE "public"."checklist_items" ALTER COLUMN "category" TYPE "public"."ChecklistCategory_new" USING ("category"::text::"public"."ChecklistCategory_new");
ALTER TYPE "public"."ChecklistCategory" RENAME TO "ChecklistCategory_old";
ALTER TYPE "public"."ChecklistCategory_new" RENAME TO "ChecklistCategory";
DROP TYPE "public"."ChecklistCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ExpenseCategory_new" AS ENUM ('TRANSPORT', 'ACCOMMODATION', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'MISC');
ALTER TABLE "public"."expenses" ALTER COLUMN "category" TYPE "public"."ExpenseCategory_new" USING ("category"::text::"public"."ExpenseCategory_new");
ALTER TYPE "public"."ExpenseCategory" RENAME TO "ExpenseCategory_old";
ALTER TYPE "public"."ExpenseCategory_new" RENAME TO "ExpenseCategory";
DROP TYPE "public"."ExpenseCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PinType_new" AS ENUM ('RESTAURANT', 'ATTRACTION', 'HOTEL', 'TRANSPORT', 'SHOPPING', 'CUSTOM');
ALTER TABLE "public"."locations" ALTER COLUMN "pin_type" TYPE "public"."PinType_new" USING ("pin_type"::text::"public"."PinType_new");
ALTER TYPE "public"."PinType" RENAME TO "PinType_old";
ALTER TYPE "public"."PinType_new" RENAME TO "PinType";
DROP TYPE "public"."PinType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "public"."Priority" ADD VALUE 'CRITICAL';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReservationType_new" AS ENUM ('RESTAURANT', 'HOTEL', 'ACTIVITY', 'TRANSPORT', 'OTHER');
ALTER TABLE "public"."reservations" ALTER COLUMN "type" TYPE "public"."ReservationType_new" USING ("type"::text::"public"."ReservationType_new");
ALTER TYPE "public"."ReservationType" RENAME TO "ReservationType_old";
ALTER TYPE "public"."ReservationType_new" RENAME TO "ReservationType";
DROP TYPE "public"."ReservationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TripMemberRole_new" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
ALTER TABLE "public"."trip_members" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."trip_members" ALTER COLUMN "role" TYPE "public"."TripMemberRole_new" USING ("role"::text::"public"."TripMemberRole_new");
ALTER TYPE "public"."TripMemberRole" RENAME TO "TripMemberRole_old";
ALTER TYPE "public"."TripMemberRole_new" RENAME TO "TripMemberRole";
DROP TYPE "public"."TripMemberRole_old";
ALTER TABLE "public"."trip_members" ALTER COLUMN "role" SET DEFAULT 'VIEWER';
COMMIT;

-- AlterTable
ALTER TABLE "public"."trip_members" DROP COLUMN "permissions";

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TripPermission_new" AS ENUM ('READ', 'WRITE', 'DELETE', 'ADMIN');
ALTER TYPE "public"."TripPermission" RENAME TO "TripPermission_old";
ALTER TYPE "public"."TripPermission_new" RENAME TO "TripPermission";
DROP TYPE "public"."TripPermission_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."checklist_items" DROP CONSTRAINT "checklist_items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."itinerary_items" DROP CONSTRAINT "itinerary_items_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."itinerary_items" DROP CONSTRAINT "itinerary_items_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."itinerary_items" DROP CONSTRAINT "itinerary_items_trip_id_fkey";

-- AlterTable
ALTER TABLE "public"."activities" DROP COLUMN "completed",
DROP COLUMN "estimated_duration",
DROP COLUMN "priority",
DROP COLUMN "title",
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price_level" INTEGER,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "public"."checklist_items" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
ALTER COLUMN "category" SET DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "public"."expenses" DROP COLUMN "amount",
DROP COLUMN "description",
DROP COLUMN "location_id",
DROP COLUMN "reservation_id",
DROP COLUMN "user_id",
ADD COLUMN     "amount_jpy" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "amount_original" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "created_by_user_id" TEXT NOT NULL,
ADD COLUMN     "currency_original" TEXT NOT NULL,
ADD COLUMN     "fx_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."itinerary_items" DROP COLUMN "created_by",
DROP COLUMN "day",
DROP COLUMN "location_id",
ADD COLUMN     "created_by_user_id" TEXT NOT NULL,
ADD COLUMN     "day_id" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "place_id" TEXT,
ADD COLUMN     "status" "public"."ItemStatus" NOT NULL DEFAULT 'PLANNED';

-- AlterTable
ALTER TABLE "public"."locations" DROP COLUMN "custom_notes",
DROP COLUMN "google_place_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "pin_type" SET DEFAULT 'CUSTOM';

-- AlterTable
ALTER TABLE "public"."reservations" DROP COLUMN "confirmation_code",
DROP COLUMN "cost",
DROP COLUMN "date_time",
DROP COLUMN "title",
ADD COLUMN     "confirmation" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "party_size" INTEGER,
ADD COLUMN     "time" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "public"."days" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "note" TEXT,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."places" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "source_url" TEXT,
    "category" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weather_cache" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "weather" JSONB NOT NULL,
    "fetched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "days_trip_id_date_key" ON "public"."days"("trip_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "weather_cache_day_id_key" ON "public"."weather_cache"("day_id");

-- CreateIndex
CREATE INDEX "expenses_trip_id_date_idx" ON "public"."expenses"("trip_id", "date");

-- CreateIndex
CREATE INDEX "itinerary_items_day_id_start_time_idx" ON "public"."itinerary_items"("day_id", "start_time");

-- AddForeignKey
ALTER TABLE "public"."itinerary_items" ADD CONSTRAINT "itinerary_items_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itinerary_items" ADD CONSTRAINT "itinerary_items_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "public"."days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itinerary_items" ADD CONSTRAINT "itinerary_items_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itinerary_items" ADD CONSTRAINT "itinerary_items_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."days" ADD CONSTRAINT "days_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."places" ADD CONSTRAINT "places_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."places" ADD CONSTRAINT "places_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expenses" ADD CONSTRAINT "expenses_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weather_cache" ADD CONSTRAINT "weather_cache_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "public"."days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklist_items" ADD CONSTRAINT "checklist_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
