const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@riocuiabalodge.com.br' }
  });
  console.log('User found in DB:', user);
  
  const bcrypt = require('bcryptjs');
  if (user) {
    const isValid = await bcrypt.compare('Rio@2026', user.passwordHash);
    console.log('Password valid:', isValid);
  }
}
main().finally(() => prisma.$disconnect());
