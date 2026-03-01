-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT;

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "driverSuspendedUntil" TIMESTAMP(3),
ADD COLUMN     "passengerSuspendedUntil" TIMESTAMP(3);
