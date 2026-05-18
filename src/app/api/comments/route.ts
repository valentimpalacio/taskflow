import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/comments - Create comment
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, taskId, projectId, parentId, mentions } = await request.json();

  if (!content || (!taskId && !projectId)) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to save comment
  // const comment = await prisma.comment.create({...})
  // TODO: Create notifications for mentioned users

  return NextResponse.json(
    { message: 'Comment created successfully', id: 'temp-id' },
    { status: 201 }
  );
}

// GET /api/comments?taskId=... or ?projectId=... - Get comments
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const projectId = searchParams.get('projectId');

  if (!taskId && !projectId) {
    return NextResponse.json(
      { error: 'Missing taskId or projectId' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to fetch comments
  // const comments = await prisma.comment.findMany({...})

  return NextResponse.json([]);
}

// DELETE /api/comments/[id] - Delete comment
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing comment ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to delete comment
  // TODO: Delete associated replies
  // await prisma.comment.delete({...})

  return NextResponse.json({ message: 'Comment deleted successfully' });
}
