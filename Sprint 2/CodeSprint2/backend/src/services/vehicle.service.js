const prisma = require("../utils/prisma");
const ApiError = require("../utils/ApiError");

const baseOrder = { createdAt: "desc" };

const buildVehicleWhere = (opts = {}) => {
  const {
    q,
    vehicleType,
    color,
    isDefault,
    seatMin,
    seatMax,
    amenitiesAny,
    amenitiesAll,
    userId,
  } = opts;

  return {
    ...(userId && { userId }),
    ...(vehicleType && {
      vehicleType: { contains: vehicleType, mode: "insensitive" },
    }),
    ...(color && { color: { contains: color, mode: "insensitive" } }),
    ...(typeof isDefault === "boolean" ? { isDefault } : {}),
    ...(typeof seatMin === "number" || typeof seatMax === "number"
      ? {
          seatCapacity: {
            ...(typeof seatMin === "number" ? { gte: seatMin } : {}),
            ...(typeof seatMax === "number" ? { lte: seatMax } : {}),
          },
        }
      : {}),
    ...(amenitiesAny && amenitiesAny.length
      ? { amenities: { hasSome: amenitiesAny } }
      : {}),
    ...(amenitiesAll && amenitiesAll.length
      ? { amenities: { hasEvery: amenitiesAll } }
      : {}),
    ...(q
      ? {
          OR: [
            { vehicleModel: { contains: q, mode: "insensitive" } },
            { vehicleType: { contains: q, mode: "insensitive" } },
            { color: { contains: q, mode: "insensitive" } },
            { licensePlate: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
};

const searchMyVehicles = async (ownerId, opts) => {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
    ...filters
  } = opts || {};
  const where = buildVehicleWhere({ ...filters, userId: ownerId });

  const skip = (page - 1) * limit,
    take = limit;

  const [total, data] = await prisma.$transaction([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
  ]);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const searchVehiclesAdmin = async (opts) => {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
    ...filters
  } = opts || {};
  const where = buildVehicleWhere(filters);
  const skip = (page - 1) * limit,
    take = limit;

  const [total, data] = await prisma.$transaction([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      }, // useful in admin table
    }),
  ]);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getAllVehicles = async (userId) => {
  return prisma.vehicle.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const getVehicleById = async (vehicleId, userId) => {
  const v = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!v || v.userId !== userId) {
    throw new ApiError(404, "Vehicle not found or access denied");
  }
  return v;
};

const createVehicle = async (data, userId) => {
  if (data.isDefault) {
    // reset previous default
    await prisma.vehicle.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.vehicle.create({
    data: { ...data, userId },
  });
};

const updateVehicle = async (vehicleId, userId, updateData) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.vehicle.findUnique({ where: { id: vehicleId } });
    if (!existing || existing.userId !== userId) {
      throw new ApiError(404, "Vehicle not found or access denied");
    }

    if (updateData.isDefault === true && !existing.isDefault) {
      await tx.vehicle.updateMany({
        where: { userId, isDefault: true, NOT: { id: vehicleId } },
        data: { isDefault: false },
      });
    }

    const updated = await tx.vehicle.update({
      where: { id: vehicleId },
      data: { ...updateData, userId },
    });

    return updated;
  });
};

const deleteVehicle = async (vehicleId, userId) => {
  const existingVehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
  });
  if (!existingVehicle) {
    throw new Error("Vehicle not found or access denied");
  }

  await prisma.vehicle.delete({ where: { id: vehicleId } });
  return { id: vehicleId };
};

const setDefaultVehicle = async (vehicleId, userId) => {
  const vehicleToSetDefault = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
  });
  if (!vehicleToSetDefault) {
    throw new Error("Vehicle not found or access denied");
  }

  if (vehicleToSetDefault.isDefault) {
    return vehicleToSetDefault;
  }

  return prisma.$transaction(async (tx) => {
    await tx.vehicle.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
    const updatedVehicle = await tx.vehicle.update({
      where: { id: vehicleId },
      data: { isDefault: true },
    });
    return updatedVehicle;
  });
};

const getVehicleByIdAdmin = async (vehicleId) => {
  const v = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
        },
      },
    },
  });
  if (!v) throw new ApiError(404, "Vehicle not found");
  return v;
};

const updateVehicleByAdmin = async (vehicleId, updateData) => {
  const existing = await getVehicleByIdAdmin(vehicleId);

  const targetUserId = updateData.userId ?? existing.userId;

  return prisma.$transaction(async (tx) => {
    // ถ้าจะตั้ง default ให้คันนี้ → reset คันอื่นของเจ้าของเป้าหมาย
    if (updateData.isDefault === true) {
      await tx.vehicle.updateMany({
        where: {
          userId: targetUserId,
          isDefault: true,
          NOT: { id: vehicleId },
        },
        data: { isDefault: false },
      });
    }

    const updated = await tx.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...updateData,
        userId: targetUserId,
      },
    });

    return updated;
  });
};

const deleteVehicleByAdmin = async (vehicleId) => {
  await getVehicleByIdAdmin(vehicleId);
  await prisma.vehicle.delete({ where: { id: vehicleId } });
  return { id: vehicleId };
};

module.exports = {
  searchMyVehicles,
  searchVehiclesAdmin,
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
  getVehicleByIdAdmin,
  updateVehicleByAdmin,
  deleteVehicleByAdmin,
};
