const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.admin.upsert({
      where: { username: 'admin' },
      update: { password: 'admin123' },
      create: { username: 'admin', password: 'admin123' }
    });
    console.log('--- ADMIN ACCOUNT READY ---');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
