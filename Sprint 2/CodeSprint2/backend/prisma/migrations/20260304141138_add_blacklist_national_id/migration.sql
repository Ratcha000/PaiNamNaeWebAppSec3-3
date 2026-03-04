-- CreateTable
CREATE TABLE "BlacklistedNationalId" (
    "id" TEXT NOT NULL,
    "nationalIdNumber" TEXT NOT NULL,
    "reason" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'warning',
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlacklistedNationalId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedNationalId_nationalIdNumber_key" ON "BlacklistedNationalId"("nationalIdNumber");

-- CreateIndex
CREATE INDEX "BlacklistedNationalId_nationalIdNumber_idx" ON "BlacklistedNationalId"("nationalIdNumber");

-- CreateIndex
CREATE INDEX "BlacklistedNationalId_adminId_idx" ON "BlacklistedNationalId"("adminId");

-- AddForeignKey
ALTER TABLE "BlacklistedNationalId" ADD CONSTRAINT "BlacklistedNationalId_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
