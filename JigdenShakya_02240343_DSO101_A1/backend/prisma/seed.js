const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();

  const tasks = [
    {
      title: 'Set up development environment',
      description: 'Install Node.js, PostgreSQL, and configure local environment variables.',
      due_date: new Date('2025-04-10'),
      priority: 'high',
      completed: true,
    },
    {
      title: 'Design database schema',
      description: 'Define tables, relationships, and constraints for the PostgreSQL database.',
      due_date: new Date('2025-04-12'),
      priority: 'high',
      completed: true,
    },
    {
      title: 'Implement REST API endpoints',
      description: 'Build CRUD operations for tasks using Express.js and Prisma ORM.',
      due_date: new Date('2025-04-15'),
      priority: 'high',
      completed: false,
    },
    {
      title: 'Build React frontend',
      description: 'Create Next.js pages and components with Tailwind CSS styling.',
      due_date: new Date('2025-04-18'),
      priority: 'medium',
      completed: false,
    },
    {
      title: 'Write unit and integration tests',
      description: 'Cover all API endpoints with Jest and Supertest, add React Testing Library tests.',
      due_date: new Date('2025-04-20'),
      priority: 'low',
      completed: false,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log('Seeded 5 sample tasks successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });