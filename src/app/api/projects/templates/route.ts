import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/projects/templates - Get all project templates
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Implement Prisma client to fetch templates
  // const templates = await prisma.project.findMany({
  //   where: { isTemplate: true },
  //   include: { tasks: true },
  // })

  return NextResponse.json([]);
}

// POST /api/projects/from-template - Create project from template
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { templateId } = await request.json();

  if (!templateId) {
    return NextResponse.json(
      { error: 'Missing template ID' },
      { status: 400 }
    );
  }

  // TODO: Implement template cloning logic
  // 1. Fetch template project with all tasks
  // 2. Create new project with duplicated structure
  // 3. Copy all tasks, subtasks, tags
  // 4. Assign to current user
  // 5. Return new project details

  return NextResponse.json(
    { message: 'Project created from template successfully', projectId: 'temp-id' },
    { status: 201 }
  );
}
