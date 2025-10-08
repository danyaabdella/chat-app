import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create some sample users
  const user1 = await prisma.user.upsert({
    where: { username: 'Alice' },
    update: {},
    create: { username: 'Alice' },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'Bob' },
    update: {},
    create: { username: 'Bob' },
  });

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        content: 'Hello everyone! Welcome to the chat app.',
        userId: user1.id,
      },
      {
        content: 'Hi Alice! This app looks great.',
        userId: user2.id,
      },
    ],
  });

  console.log('Seeding completed');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });