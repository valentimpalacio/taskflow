const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  const user = await prisma.user.findFirst();
  console.log('User:', user);
  
  const projects = await prisma.project.count();
  console.log('Projects:', projects);
  
  const tasks = await prisma.task.count();
  console.log('Tasks:', tasks);
  
  await prisma.$disconnect();
}

main().catch(console.error);