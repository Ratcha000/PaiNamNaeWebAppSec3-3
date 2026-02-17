const asyncHandler = require("express-async-handler");
const vehicleService = require("../services/vehicle.service");
const ApiError = require("../utils/ApiError");
const { uploadToCloudinary } = require('../utils/cloudinary');
const userService = require("../services/user.service");

const listMyVehicles = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const result = await vehicleService.searchMyVehicles(ownerId, req.query);
  res.status(200).json({
    success: true,
    message: "Vehicles retrieved successfully.",
    ...result
  });
});

const getVehicles = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const list = await vehicleService.getAllVehicles(ownerId);

  res.status(200).json({
    success: true,
    message: "Vehicles retrieved successfully.",
    data: list,
  });
});

const getVehicleById = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { id } = req.params;
  const vehicle = await vehicleService.getVehicleById(id, ownerId);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  res.status(200).json({
    success: true,
    message: "Vehicle retrieved successfully.",
    data: vehicle,
  });
});

const getVehicleByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vehicle = await vehicleService.getVehicleByIdAdmin(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  res.status(200).json({
    success: true,
    message: "Vehicle retrieved successfully.",
    data: vehicle,
  });
});


const createVehicle = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const payload = { ...req.body };

  if (req.files?.photos) {
    const uploads = await Promise.all(
      req.files.photos.map(file =>
        uploadToCloudinary(file.buffer, 'painamnae/vehicles')
      )
    );

    payload.photos = uploads.map(u => u.url); // เก็บเป็น array ของ URL
  }

  const newVehicle = await vehicleService.createVehicle(payload, ownerId);
  res.status(201).json({
    success: true,
    message: "Vehicle created successfully.",
    data: newVehicle,
  });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { id } = req.params
  const payload = { ...req.body };

  if (req.files?.photos) {
    const uploads = await Promise.all(
      req.files.photos.map(file =>
        uploadToCloudinary(file.buffer, 'painamnae/vehicles')
      )
    );
    payload.photos = uploads.map(u => u.url);
  }

  const updated = await vehicleService.updateVehicle(id, ownerId, payload)

  res.status(200).json({
    success: true,
    message: "Vehicle updated successfully.",
    data: updated,
  });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { id } = req.params;
  const result = await vehicleService.deleteVehicle(id, ownerId);

  res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully.",
    data: result,
  });
});

const setDefaultVehicle = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { id } = req.params;
  const result = await vehicleService.setDefaultVehicle(id, ownerId);

  res.status(200).json({
    success: true,
    message: "Vehicle set Default successfully.",
    data: result,
  });
});

const adminListVehicles = asyncHandler(async (req, res) => {
  const result = await vehicleService.searchVehiclesAdmin(req.query);
  res.status(200).json({
    success: true,
    message: "Vehicles (admin) retrieved successfully.",
    ...result
  });
});

const adminListVehiclesByUser = asyncHandler(async (req, res) => {
  const result = await vehicleService.searchVehiclesAdmin({ ...req.query, userId: req.params.userId });
  res.status(200).json({
    success: true,
    message: "User's vehicles (admin) retrieved successfully.",
    ...result
  });
});

const adminCreateVehicle = asyncHandler(async (req, res) => {
  const { userId } = req.body
  const payload = { ...req.body };

  await userService.getUserById(userId)

  if (req.files?.photos) {
    const uploads = await Promise.all(
      req.files.photos.map(file =>
        uploadToCloudinary(file.buffer, 'painamnae/vehicles')
      )
    );

    payload.photos = uploads.map(u => u.url); // เก็บเป็น array ของ URL
  }

  const newVehicle = await vehicleService.createVehicle(payload, userId);
  res.status(201).json({
    success: true,
    message: "Vehicle created successfully.",
    data: newVehicle,
  });
})

const adminUpdateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };

  if (payload.userId) {
    await userService.getUserById(payload.userId);
  }

  if (req.files?.photos) {
    const uploads = await Promise.all(
      req.files.photos.map(file => uploadToCloudinary(file.buffer, 'painamnae/vehicles'))
    );
    payload.photos = uploads.map(u => u.url);
  }

  const updated = await vehicleService.updateVehicleByAdmin(id, payload);
  res.status(200).json({
    success: true,
    message: "Vehicle (by admin) updated successfully.",
    data: updated,
  });
});

const adminDeleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await vehicleService.deleteVehicleByAdmin(id);
  res.status(200).json({
    success: true,
    message: "Vehicle (by admin) deleted successfully.",
    data: result,
  });
});

module.exports = {
  listMyVehicles,
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
  adminCreateVehicle,
  adminUpdateVehicle,
  adminDeleteVehicle,
  adminListVehiclesByUser,
  adminListVehicles,
  getVehicleByIdAdmin,
};
