const prisma = require('../utils/prisma')

// ✅ CREATE
exports.createIncident = async (data) => {
  return prisma.incident.create({
    data
  })
}


// ✅ GET ALL (ใช้หน้า admin list)
exports.getAllIncidents = async () => {
  return prisma.incident.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}


// ✅ GET BY ID (ใช้หน้า detail)
exports.getIncidentById = async (id) => {
  return prisma.incident.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  })
}


// ✅ UPDATE STATUS
exports.updateIncidentStatus = async (id, status) => {
  return prisma.incident.update({
    where: { id },
    data: { status }
  })
}