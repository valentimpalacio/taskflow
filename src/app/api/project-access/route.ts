import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/projects/[id]/access - Get project access list
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json(
      { error: 'Missing project ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to fetch project access
  // const access = await prisma.projectAccess.findMany({
  //   where: { projectId },
  //   include: { user: true },
  // })

  return NextResponse.json([]);
}

// POST /api/projects/[id]/access - Add user to project
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, email, role } = await request.json();

  if (!projectId || !email || !role) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to add access
  // TODO: Check if user is project owner
  // TODO: Create notification for user

  return NextResponse.json(
    { message: 'User added to project successfully' },
    { status: 201 }
  );
}

// PUT /api/projects/[id]/access/[accessId] - Update access role
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { accessId, role } = await request.json();

  if (!accessId || !role) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to update access role

  return NextResponse.json({ message: 'Access role updated successfully' });
}

// DELETE /api/projects/[id]/access/[accessId] - Remove user from project
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const accessId = searchParams.get('accessId');

  if (!accessId) {
    return NextResponse.json(
      { error: 'Missing access ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to remove access

  return NextResponse.json({
    message: 'User removed from project successfully',
  });
}
