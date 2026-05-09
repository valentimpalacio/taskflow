import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateTaskInput } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page?: string; limit?: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { page = '1', limit = '10' } = await params;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

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

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: { userId: session.user.email },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.task.count({ where: { userId: session.user.email } }),
  ]);

  return NextResponse.json(
    {
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    {
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  const validation = validateTaskInput(body);
  if (!validation.valid || !validation.data) {
    return NextResponse.json({ error: validation.error || 'Invalid data' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const project = await prisma.project.findFirst({
    where: { id: validation.data.projectId, userId: user.id },
  });
  if (!project) {
    return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
  }

  const task = await prisma.task.create({
    data: {
      title: validation.data.title,
      description: validation.data.description,
      status: 'todo',
      projectId: validation.data.projectId,
      userId: user.id,
    },
  });

  return NextResponse.json(task, {
    status: 201,
    headers: {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
    },
  });
}
