-- CreateEnum
CREATE TYPE "public"."ExpenseType" AS ENUM ('PLANNED', 'ACTUAL');

-- AlterEnum
ALTER TYPE "public"."ExpenseCategory" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "public"."expenses" ADD COLUMN     "day_id" TEXT,
ADD COLUMN     "expense_type" "public"."ExpenseType" NOT NULL DEFAULT 'ACTUAL';

-- AlterTable
ALTER TABLE "public"."trips" ADD COLUMN     "home_currency" TEXT NOT NULL DEFAULT 'USD';

-- AddForeignKey
ALTER TABLE "public"."expenses" ADD CONSTRAINT "expenses_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "public"."days"("id") ON DELETE SET NULL ON UPDATE CASCADE;
