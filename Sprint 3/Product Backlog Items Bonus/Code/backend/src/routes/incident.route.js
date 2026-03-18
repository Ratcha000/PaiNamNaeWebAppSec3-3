const express = require('express')
const router = express.Router()

const incidentController = require('../controllers/incident.controller')
const { protect, requireAdmin } = require('../middlewares/auth')

// ✅ CREATE (user)
router.post('/', protect, incidentController.createIncident)

// ✅ GET ALL (admin ใช้หน้า list)
router.get('/', protect, incidentController.getAllIncidents)

// ✅ GET BY ID (หน้า detail)
router.get('/:id', protect, incidentController.getIncidentById)

// ✅ UPDATE STATUS (admin)
router.patch('/:id/status', protect, requireAdmin, incidentController.updateIncidentStatus)

module.exports = router