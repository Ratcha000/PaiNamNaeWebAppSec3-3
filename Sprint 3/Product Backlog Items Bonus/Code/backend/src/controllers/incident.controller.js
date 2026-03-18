const asyncHandler = require('express-async-handler')
const incidentService = require('../services/incident.service')
const prisma = require('../utils/prisma')
const notifService = require('../services/notification.service')


// CREATE
exports.createIncident = asyncHandler(async (req, res) => {
  const { title, description } = req.body

  const incident = await incidentService.createIncident({
    title,
    description,
    userId: req.user.id
  })

  res.status(201).json({
    success: true,
    data: incident
  })
})


// GET ALL (สำหรับหน้า admin list)
exports.getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await incidentService.getAllIncidents()

  res.json({
    success: true,
    data: incidents
  })
})


// GET BY ID (สำหรับหน้า detail)
exports.getIncidentById = asyncHandler(async (req, res) => {
  const incident = await incidentService.getIncidentById(req.params.id)

  if (!incident) {
    return res.status(404).json({
      success: false,
      message: 'Incident not found'
    })
  }

  res.json({
    success: true,
    data: incident
  })
})


// UPDATE STATUS + SEND NOTIFICATION ✅ (ตัวสำคัญ)
exports.updateIncidentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  // อัปเดตสถานะ
  const incident = await prisma.incident.update({
    where: { id: req.params.id },
    data: { status }
  })

  console.log('📌 Updated incident:', incident.id, 'status:', status)

  // ✅ ส่ง notification (ใช้ตัวที่ map body ให้อัตโนมัติ)
  try {
    const notif = await notifService.createNotificationByAdminSimple({
      userId: incident.userId,
      type: 'INCIDENT',
      title: 'Incident Status Updated',
      message: `Your incident "${incident.title}" is now ${status}`,
      relatedId: incident.id
    })

    console.log('✅ Notification created:', notif.id)

  } catch (err) {
    console.error('❌ Notification error:', err.message)
  }

  res.json({
    success: true,
    message: 'Status updated successfully',
    data: incident
  })
})