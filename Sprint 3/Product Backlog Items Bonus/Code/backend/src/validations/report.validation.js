const Joi = require('joi');

const createReportSchema = Joi.object().keys({
  reportedUserId: Joi.string().required(),
  category: Joi.string().valid('behavior', 'safety', 'fraud', 'other').required(),
  description: Joi.string().min(10).max(5000).required()
});

const reviewReportSchema = Joi.object().keys({
  severity: Joi.string().valid('warning', 'blacklist').required(),
  adminNote: Joi.string().max(2000)
});

const sendWarningSchema = Joi.object().keys({
  subject: Joi.string().required(),
  message: Joi.string().min(10).max(5000).required()
});

const listReportsQuerySchema = Joi.object().keys({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'reviewed', 'resolved'),
  severity: Joi.string().valid('warning', 'blacklist'),
  sortBy: Joi.string().valid('createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

module.exports = {
  createReportSchema,
  reviewReportSchema,
  sendWarningSchema,
  listReportsQuerySchema
};