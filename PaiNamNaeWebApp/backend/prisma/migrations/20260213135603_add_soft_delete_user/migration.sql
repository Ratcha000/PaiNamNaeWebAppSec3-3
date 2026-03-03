-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleteReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "scheduledDeleteAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_scheduledDeleteAt_idx" ON "User"("scheduledDeleteAt");
