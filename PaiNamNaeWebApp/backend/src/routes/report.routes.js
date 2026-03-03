const express = require('express');
const reportController = require('../controllers/report.controller');
const validate = require('../middlewares/validate');
const { protect, requireAdmin } = require('../middlewares/auth');
const { createReportSchema, reviewReportSchema, sendWarningSchema, listReportsQuerySchema } = require('../validations/report.validation');

const router = express.Router();

router.post('/', protect, validate(createReportSchema), reportController.submitReport);
router.get('/', protect, requireAdmin, validate(listReportsQuerySchema), reportController.listReports);
router.get('/:reportId', protect, requireAdmin, reportController.getReportDetail);
router.patch('/:reportId/review', protect, requireAdmin, validate(reviewReportSchema), reportController.reviewReport);
router.post('/:reportId/send-warning', protect, requireAdmin, validate(sendWarningSchema), reportController.sendWarningMessage);
router.get('/admin/blacklist/users', protect, requireAdmin, reportController.getBlacklistedUsers);
router.patch('/admin/:userId/remove-blacklist', protect, requireAdmin, reportController.removeBlacklist);

module.exports = router;