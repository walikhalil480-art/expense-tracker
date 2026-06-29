import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      categories: {
        create: [
          { name: 'Food', color: '#ff5722' },
          { name: 'Rent', color: '#3f51b5' },
          { name: 'Utilities', color: '#009688' },
          { name: 'Entertainment', color: '#e91e63' },
          { name: 'Salary', color: '#4caf50' }
        ]
      }
    }
  });

  console.log('Seed completed. Test user created:', user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
