-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "adminReviewedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Notification_adminReviewedAt_idx" ON "Notification"("adminReviewedAt");
