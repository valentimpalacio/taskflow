import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo@123456', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@taskflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  // Create projects
  const website = await prisma.project.create({
    data: { name: 'Website Redesign', description: 'Complete overhaul of the company website with modern design', userId: user.id },
  });
  const mobile = await prisma.project.create({
    data: { name: 'Mobile App', description: 'Cross-platform mobile application for iOS and Android', userId: user.id },
  });
  const api = await prisma.project.create({
    data: { name: 'API Development', description: 'RESTful API for the new microservices architecture', userId: user.id },
  });

  // Create tasks
  const tasks = [
    { title: 'Design homepage mockup', description: 'Create Figma mockup for the new homepage', status: 'done', projectId: website.id, userId: user.id },
    { title: 'Implement responsive nav', description: 'Mobile-friendly navigation component', status: 'in_progress', projectId: website.id, userId: user.id },
    { title: 'Set up analytics', description: 'Integrate Google Analytics and event tracking', status: 'todo', projectId: website.id, userId: user.id },
    { title: 'User authentication flow', description: 'Login, signup, and password recovery screens', status: 'done', projectId: mobile.id, userId: user.id },
    { title: 'Push notifications', description: 'Implement push notification service', status: 'in_progress', projectId: mobile.id, userId: user.id },
    { title: 'Offline mode', description: 'Cache data for offline access', status: 'todo', projectId: mobile.id, userId: user.id },
    { title: 'Design REST endpoints', description: 'Define API structure and endpoints', status: 'done', projectId: api.id, userId: user.id },
    { title: 'JWT authentication', description: 'Implement token-based auth middleware', status: 'in_progress', projectId: api.id, userId: user.id },
    { title: 'Rate limiting', description: 'Add rate limiting to protect the API', status: 'todo', projectId: api.id, userId: user.id },
    { title: 'API documentation', description: 'Generate OpenAPI docs with Swagger', status: 'todo', projectId: api.id, userId: user.id },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log('Database seeded successfully!');
  console.log('Demo credentials: demo@taskflow.com / Demo@123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
