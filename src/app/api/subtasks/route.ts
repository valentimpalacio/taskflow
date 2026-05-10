import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/subtasks?taskId=xxx - Get subtasks for a task
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Missing taskId parameter' }, { status: 400 });
  }

  // TODO: Implement Prisma client to fetch subtasks
  // const subtasks = await prisma.subtask.findMany({
  //   where: { taskId },
  //   orderBy: { createdAt: 'asc' },
  // })

  return NextResponse.json([]);
}

// POST /api/subtasks - Create subtask
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { taskId, title } = await request.json();

  if (!taskId || !title) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to save subtask
  // const subtask = await prisma.subtask.create({...})

  return NextResponse.json(
    { message: 'Subtask created successfully', id: 'temp-id' },
    { status: 201 }
  );
}

// PUT /api/subtasks/[id] - Update subtask
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const { completed, title } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Missing subtask ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to update subtask
  // const subtask = await prisma.subtask.update({...})

  return NextResponse.json({
    message: 'Subtask updated successfully',
  });
}

// DELETE /api/subtasks/[id] - Delete subtask
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing subtask ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to delete subtask
  // await prisma.subtask.delete({...})

  return NextResponse.json({
    message: 'Subtask deleted successfully',
  });
}
