const { z } = require("zod");
const { VerificationStatus, LicenseType } = require("@prisma/client");

const createDriverVerificationSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  firstNameOnLicense: z.string().min(1, "First name on license is required"),
  lastNameOnLicense: z.string().min(1, "Last name on license is required"),
  typeOnLicense: z.nativeEnum(LicenseType, {
    required_error: "License type is required",
    invalid_type_error: "Invalid license type",
  }),
  licenseIssueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for licenseIssueDate",
  }),
  licenseExpiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for licenseExpiryDate",
  }),
});

const createDriverVerificationByAdminSchema = z.object({
  userId: z.string().cuid({ message: "userId must be a CUID" }),
  licenseNumber: z.string().min(1, "License number is required"),
  firstNameOnLicense: z.string().min(1, "First name on license is required"),
  lastNameOnLicense: z.string().min(1, "Last name on license is required"),
  typeOnLicense: z.nativeEnum(LicenseType, {
    required_error: "License type is required",
    invalid_type_error: "Invalid license type",
  }),
  licenseIssueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for licenseIssueDate",
  }),
  licenseExpiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for licenseExpiryDate",
  }),
  status: z.nativeEnum(VerificationStatus).optional(),
});

const idParamSchema = z.object({
  id: z.string().cuid({ message: "Invalid DriverVerification ID format" }),
});

const updateDriverVerificationSchema = createDriverVerificationSchema.partial();

const updateVerificationStatusSchema = z.object({
  status: z.nativeEnum(VerificationStatus, {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
});

const listDriverVerifsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  q: z.string().trim().min(1).optional(),
  status: z.nativeEnum(VerificationStatus).optional(),
  typeOnLicense: z.nativeEnum(LicenseType).optional(),

  createdFrom: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid createdFrom" }).optional(),
  createdTo: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid createdTo" }).optional(),
  issueFrom: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid issueFrom" }).optional(),
  issueTo: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid issueTo" }).optional(),
  expiryFrom: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid expiryFrom" }).optional(),
  expiryTo: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid expiryTo" }).optional(),

  sortBy: z.enum([
    "createdAt", "updatedAt",
    "licenseIssueDate", "licenseExpiryDate",
    "status", "licenseNumber"
  ]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
const updateDriverVerificationByAdminSchema = createDriverVerificationByAdminSchema
  .partial()
  .extend({
    licenseNumber: z.string().min(1).optional(),
    userId: z.string().cuid().optional(),
  });

module.exports = {
  idParamSchema,
  createDriverVerificationSchema,
  updateDriverVerificationSchema,
  updateVerificationStatusSchema,
  listDriverVerifsQuerySchema,
  updateDriverVerificationByAdminSchema,
  createDriverVerificationByAdminSchema,
};