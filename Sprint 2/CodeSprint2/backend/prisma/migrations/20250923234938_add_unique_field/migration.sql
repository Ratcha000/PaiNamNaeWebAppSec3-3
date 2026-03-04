/*
  Warnings:

  - A unique constraint covering the columns `[nationalIdNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Route_driverId_idx" ON "Route"("driverId");

-- CreateIndex
CREATE INDEX "Route_vehicleId_idx" ON "Route"("vehicleId");

-- CreateIndex
CREATE INDEX "Route_status_idx" ON "Route"("status");

-- CreateIndex
CREATE INDEX "Route_createdAt_idx" ON "Route"("createdAt");

-- CreateIndex
CREATE INDEX "Route_departureTime_idx" ON "Route"("departureTime");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalIdNumber_key" ON "User"("nationalIdNumber");

-- CreateIndex
CREATE INDEX "Vehicle_userId_idx" ON "Vehicle"("userId");

-- CreateIndex
CREATE INDEX "Vehicle_createdAt_idx" ON "Vehicle"("createdAt");

-- CreateIndex
CREATE INDEX "Vehicle_vehicleType_idx" ON "Vehicle"("vehicleType");

-- CreateIndex
CREATE INDEX "Vehicle_seatCapacity_idx" ON "Vehicle"("seatCapacity");
