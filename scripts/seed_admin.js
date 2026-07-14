const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@riocuiabalodge.com.br';
  const password = 'Rio@2026';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'SUPERADMIN',
    },
    create: {
      email,
      name: 'Super Admin',
      passwordHash,
      role: 'SUPERADMIN',
    },
  });

  console.log('Super Admin user seeded:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
