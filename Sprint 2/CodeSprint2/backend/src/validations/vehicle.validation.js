const { z } = require('zod')

const createVehicleSchema = z.object({
  vehicleModel: z.string().min(1, 'vehicleModel is required'),
  licensePlate: z.string().min(1, 'licensePlate is required'),
  vehicleType: z.string().min(1, 'vehicleType is required'),
  color: z.string().min(1, 'color is required'),
  seatCapacity: z.number().int({ message: 'seatCapacity must be an integer' }),
  amenities: z.array(z.string().min(1, 'Each amenity must be a non-empty string')),
  photos: z.array(z.string().url('Each photo must be a valid URL')).optional(),
  isDefault: z.boolean().optional(),
});

const idParamSchema = z.object({
  id: z.string().cuid({ message: 'Invalid vehicle ID format' }),
});

const updateVehicleSchema = createVehicleSchema.partial();

const createVehicleByAdminSchema = createVehicleSchema.extend({
  userId: z.string().cuid({ message: 'userId must be a CUID' }),
});

const updateVehicleByAdminSchema = updateVehicleSchema.extend({
  userId: z.string().cuid({ message: 'userId must be a CUID' }).optional(),
});

const listMyVehiclesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  q: z.string().trim().min(1).optional(),       // free-text: model/type/color/plate
  vehicleType: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  isDefault: z.coerce.boolean().optional(),
  seatMin: z.coerce.number().int().min(0).optional(),
  seatMax: z.coerce.number().int().min(0).optional(),

  amenitiesAny: z.preprocess(v => (typeof v === 'string' ? [v] : v), z.array(z.string().min(1)).optional()),
  amenitiesAll: z.preprocess(v => (typeof v === 'string' ? [v] : v), z.array(z.string().min(1)).optional()),

  sortBy: z.enum(['createdAt', 'vehicleModel', 'seatCapacity']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});


const listVehiclesAdminQuerySchema = listMyVehiclesQuerySchema.extend({
  userId: z.string().cuid().optional(),
});

const adminUserIdParamSchema = z.object({
  userId: z.string().cuid({ message: 'Invalid user ID format' }),
});

module.exports = {
  idParamSchema,
  createVehicleSchema,
  updateVehicleSchema,
  createVehicleByAdminSchema,
  updateVehicleByAdminSchema,
  listVehiclesAdminQuerySchema,
  adminUserIdParamSchema

};