const { z } = require('zod');
const { BookingStatus } = require('@prisma/client');

const createBookingSchema = z.object({
  routeId: z.string().cuid({ message: 'Invalid route ID format' }),
  numberOfSeats: z.number().int().min(1, 'At least 1 seat must be booked'),
  pickupLocation: z.any(),
  dropoffLocation: z.any(),
});

const idParamSchema = z.object({
  id: z.string().cuid({ message: 'Invalid booking ID format' }),
});

const updateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus, {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status value',
  }),
});

const listBookingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  q: z.string().trim().min(1).optional(),              // ค้นหากว้าง (routeSummary / ชื่อผู้โดยสาร / อีเมล / ป้ายทะเบียนรถ)
  status: z.nativeEnum(BookingStatus).optional(),      // สถานะการจอง
  routeId: z.string().cuid().optional(),               // ฟิลเตอร์ตามเส้นทาง
  passengerId: z.string().cuid().optional(),           // ฟิลเตอร์ผู้โดยสาร
  driverId: z.string().cuid().optional(),              // ฟิลเตอร์คนขับ (ผ่าน booking.route.driverId)

  createdFrom: z.string().refine(v => !isNaN(Date.parse(v)), { message: 'Invalid createdFrom' }).optional(),
  createdTo: z.string().refine(v => !isNaN(Date.parse(v)), { message: 'Invalid createdTo' }).optional(),
  routeDepartureFrom: z.string().refine(v => !isNaN(Date.parse(v)), { message: 'Invalid routeDepartureFrom' }).optional(),
  routeDepartureTo: z.string().refine(v => !isNaN(Date.parse(v)), { message: 'Invalid routeDepartureTo' }).optional(),

  sortBy: z.enum(['createdAt', 'status', 'numberOfSeats']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// แอดมินสร้าง booking ต้องระบุ passengerId
const createBookingByAdminSchema = createBookingSchema.extend({
  passengerId: z.string().cuid({ message: 'Invalid passenger ID format' }),
});

// แอดมินอัปเดต booking: แก้จำนวนที่นั่ง/จุดรับส่ง/ย้าย route/แก้สถานะ
const updateBookingByAdminSchema = z.object({
  routeId: z.string().cuid().optional(),
  passengerId: z.string().cuid().optional(), // (ถ้าจะ “ย้ายผู้โดยสาร” — ส่วนใหญ่ไม่ต้อง แต่เปิดไว้)
  numberOfSeats: z.number().int().min(1).optional(),
  pickupLocation: z.any().optional(),
  dropoffLocation: z.any().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
}).refine(obj => Object.keys(obj).length > 0, { message: 'No fields to update' });

const cancelBookingSchema = z.object({
  reason: z.enum([
    'CHANGE_OF_PLAN',
    'FOUND_ALTERNATIVE',
    'DRIVER_DELAY',
    'PRICE_ISSUE',
    'WRONG_LOCATION',
    'DUPLICATE_OR_WRONG_DATE',
    'SAFETY_CONCERN',
    'WEATHER_OR_FORCE_MAJEURE',
    'COMMUNICATION_ISSUE'
  ], { required_error: 'กรุณาเลือกเหตุผลในการยกเลิก' })
});

module.exports = {
  listBookingsQuerySchema,
  createBookingByAdminSchema,
  updateBookingByAdminSchema,
  createBookingSchema,
  idParamSchema,
  updateBookingStatusSchema,
  cancelBookingSchema,
};
