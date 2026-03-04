const { z } = require("zod");
const { RouteStatus } = require("@prisma/client");

const createRouteSchema = z.object({
  // driverId: z.string().cuid({ message: "driverId must be a CUID" }),
  vehicleId: z.string().cuid({ message: "vehicleId must be a CUID" }),
  startLocation: z.any(),
  endLocation: z.any(),
  departureTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid datetime format",
  }),
  availableSeats: z.number().int().nonnegative(),
  pricePerSeat: z.number().nonnegative(),
  conditions: z.string().optional(),
  status: z.nativeEnum(RouteStatus).optional(),
  routeSummary: z.string().optional(),
  distance: z.string().optional(),
  duration: z.string().optional(),
  // waypoints: z.any().optional(),
  waypoints: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    name: z.string().optional(),
    address: z.string().optional(),
    placeId: z.string().optional(),
    via: z.boolean().optional(),
  })).optional(),
  optimizeWaypoints: z.boolean().optional(),
  landmarks: z.any().optional(),
  steps: z.any().optional(),
});

const idParamSchema = z.object({
  id: z.string().cuid({ message: "Invalid route ID format" }),
});

const updateRouteSchema = createRouteSchema.partial();

const createRouteByAdminSchema = createRouteSchema.extend({
  driverId: z.string().cuid({ message: "driverId must be a CUID" }),
});

const updateRouteByAdminSchema = updateRouteSchema.extend({
  driverId: z.string().cuid({ message: "driverId must be a CUID" }).optional(),
});

const adminDriverIdParamSchema = z.object({
  driverId: z.string().cuid({ message: "Invalid driver ID format" }),
});

const listRoutesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  q: z.string().trim().min(1).optional(), // free text
  status: z.nativeEnum(RouteStatus).optional(),
  driverId: z.string().cuid().optional(),
  vehicleId: z.string().cuid().optional(),

  dateFrom: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid dateFrom" }).optional(),
  dateTo: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid dateTo" }).optional(),

  sortBy: z.enum(["createdAt", "departureTime", "pricePerSeat", "availableSeats"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  startNearLat: z.coerce.number().optional(),
  startNearLng: z.coerce.number().optional(),
  endNearLat: z.coerce.number().optional(),
  endNearLng: z.coerce.number().optional(),
  radiusMeters: z.coerce.number().int().min(1).max(50000).default(500),

  seatsRequired: z.coerce.number().int().min(1).optional(),
});

const cancelReasonEnum = z.enum([
  'CHANGE_OF_PLAN',
  'FOUND_ALTERNATIVE',
  'DRIVER_DELAY',
  'PRICE_ISSUE',
  'WRONG_LOCATION',
  'DUPLICATE_OR_WRONG_DATE',
  'SAFETY_CONCERN',
  'WEATHER_OR_FORCE_MAJEURE',
  'COMMUNICATION_ISSUE'
]);

const cancelRouteSchema = z.object({
  reason: cancelReasonEnum
});

module.exports = {
  idParamSchema,
  createRouteSchema,
  updateRouteSchema,
  createRouteByAdminSchema,
  updateRouteByAdminSchema,
  adminDriverIdParamSchema,
  listRoutesQuerySchema,
  cancelReasonEnum,
  cancelRouteSchema
};
