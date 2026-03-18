-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentMethod" TEXT DEFAULT 'transfer',
ADD COLUMN     "submittedAt" TIMESTAMP(3);
