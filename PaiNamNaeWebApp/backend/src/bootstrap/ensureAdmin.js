const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = async function ensureAdmin() {
    const {
        ADMIN_EMAIL,
        ADMIN_USERNAME,
        ADMIN_PASSWORD,
        ADMIN_FIRST_NAME,
        ADMIN_LAST_NAME,
    } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.warn('⚠️  Skipping auto-admin bootstrap: ADMIN_EMAIL/ADMIN_USERNAME/ADMIN_PASSWORD not fully set.');
        return;
    }
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount > 0) {
        console.log('✔ Admin already exists. Skipping admin bootstrap.');
        return;
    }

    // หา user เดิมจาก email หรือ username (ถ้ามีจะอัปเกรดเป็น ADMIN)
    const existing = await prisma.user.findFirst({
        where: {
            OR: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
        },
    });

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    if (existing) {
        await prisma.user.update({
            where: { id: existing.id },
            data: {
                role: 'ADMIN',
                isVerified: true,
                isActive: true,
                password: passwordHash,
                ...(ADMIN_FIRST_NAME ? { firstName: ADMIN_FIRST_NAME } : {}),
                ...(ADMIN_LAST_NAME ? { lastName: ADMIN_LAST_NAME } : {}),
            },
        });
        console.log(`🔐 Elevated existing user (${existing.email || existing.username}) to ADMIN.`);
    } else {
        await prisma.user.create({
            data: {
                email: ADMIN_EMAIL,
                username: ADMIN_USERNAME,
                password: passwordHash,
                firstName: ADMIN_FIRST_NAME || 'Admin',
                lastName: ADMIN_LAST_NAME || '',
                role: 'ADMIN',
                isVerified: true,
                isActive: true,
            },
        });
        console.log(`🔐 Created initial ADMIN account (${ADMIN_EMAIL}).`);
    }
};
