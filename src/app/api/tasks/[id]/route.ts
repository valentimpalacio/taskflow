import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateTaskUpdate } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const rateLimitResult = await checkRateLimit(
    session.user.email,
    'api-tasks',
    100,
    60
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'Retry-After': rateLimitResult.retryAfter?.toString() || '',
        },
      }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Verificar se o usuário tem permissão para ver esta tarefa
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || task.userId !== user.id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  return NextResponse.json(task, {
    headers: {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const rateLimitResult = await checkRateLimit(
    session.user.email,
    'api-tasks',
    100,
    60
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'Retry-After': rateLimitResult.retryAfter?.toString() || '',
        },
      }
    );
  }

  const body = await request.json();
  const validation = validateTaskUpdate(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task || task.userId !== user.id) {
    return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
    },
  });

  return NextResponse.json(updatedTask, {
    headers: {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const rateLimitResult = await checkRateLimit(
    session.user.email,
    'api-tasks',
    100,
    60
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'Retry-After': rateLimitResult.retryAfter?.toString() || '',
        },
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task || task.userId !== user.id) {
    return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
  }

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json(
    { message: 'Task deleted successfully' },
    {
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
      },
    }
  );
}
