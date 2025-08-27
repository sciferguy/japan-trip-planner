-- AlterTable
ALTER TABLE "public"."trips" ADD COLUMN     "budget_accommodation" DOUBLE PRECISION,
ADD COLUMN     "budget_activities" DOUBLE PRECISION,
ADD COLUMN     "budget_food" DOUBLE PRECISION,
ADD COLUMN     "budget_misc" DOUBLE PRECISION,
ADD COLUMN     "budget_shopping" DOUBLE PRECISION,
ADD COLUMN     "budget_total" DOUBLE PRECISION,
ADD COLUMN     "budget_transport" DOUBLE PRECISION;
