const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

(async () => {
  const users = await prisma.user.findMany();
  const projects = await prisma.project.findMany();
  const tasks = await prisma.task.findMany();
  
  console.log('=== Status do Banco ===');
  console.log('Usuários:', users.length);
  console.log('Projetos:', projects.length);
  console.log('Tarefas:', tasks.length);
  
  if(users.length > 0) {
    console.log('\n✅ Demo user encontrado:', users[0].email);
  } else {
    console.log('\n⚠️ Nenhum usuário encontrado');
  }
  
  await prisma.$disconnect();
})();
