const express = require('express');
const reportController = require('../controllers/report.controller');
const validate = require('../middlewares/validate');
const { protect, requireAdmin } = require('../middlewares/auth');
const { createReportSchema, reviewReportSchema, sendWarningSchema, listReportsQuerySchema } = require('../validations/report.validation');

const router = express.Router();

// บัญชีดำ routes - ต้องอยู่ก่อน :reportId
router.get('/blacklist', protect, requireAdmin, reportController.getBlacklistedUsers);
router.delete('/blacklist/:userId', protect, requireAdmin, reportController.removeBlacklist);

// Report routes
router.post('/', protect, validate(createReportSchema), reportController.submitReport);
router.get('/', protect, requireAdmin, validate(listReportsQuerySchema), reportController.listReports);
router.get('/:reportId', protect, requireAdmin, reportController.getReportDetail);
router.patch('/:reportId/review', protect, requireAdmin, validate(reviewReportSchema), reportController.reviewReport);
router.post('/:reportId/send-warning', protect, requireAdmin, validate(sendWarningSchema), reportController.sendWarningMessage);

module.exports = router;