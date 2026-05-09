import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/tags - Create tag
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, color } = await request.json();

  if (!name || !color) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to save tag
  // const tag = await prisma.tag.create({...})

  return NextResponse.json(
    { message: 'Tag created successfully', id: 'temp-id', name, color },
    { status: 201 }
  );
}

// GET /api/tags - Get all tags
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Implement Prisma client to fetch tags
  // const tags = await prisma.tag.findMany({...})

  return NextResponse.json([]);
}

// POST /api/task-tags - Add tag to task
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { taskId, tagId } = await request.json();

  if (!taskId || !tagId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to add tag to task
  // const taskTag = await prisma.taskTag.create({...})

  return NextResponse.json({ message: 'Tag added to task successfully' });
}

// DELETE /api/task-tags - Remove tag from task
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskTagId = searchParams.get('id');

  if (!taskTagId) {
    return NextResponse.json(
      { error: 'Missing task tag ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to remove tag from task
  // await prisma.taskTag.delete({...})

  return NextResponse.json({ message: 'Tag removed from task successfully' });
}
