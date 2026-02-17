const cron = require('node-cron');
const prisma = require('../utils/prisma');

cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled user cleanup job...');

  try {
    const now = new Date();

    const result = await prisma.user.deleteMany({
      where: {
        scheduledDeleteAt: {
          lte: now
        }
      }
    });

    console.log(`Deleted ${result.count} expired users`);
  } catch (error) {
    console.error('Error deleting expired users:', error);
  }
});
