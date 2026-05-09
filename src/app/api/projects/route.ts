import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateProjectInput } from '@/lib/validators';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const rateLimitResult = await checkRateLimit(
    session.user.email,
    'api-projects',
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

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.email },
      include: { tasks: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.project.count({ where: { userId: session.user.email } }),
  ]);

  return NextResponse.json(
    {
      projects,
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
    'api-projects',
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
  const validation = validateProjectInput(body);
  if (!validation.valid || !validation.data) {
    return NextResponse.json({ error: validation.error || 'Invalid data' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const project = await prisma.project.create({
    data: {
      name: validation.data.name,
      description: validation.data.description,
      userId: user.id,
    },
  });

  return NextResponse.json(project, {
    status: 201,
    headers: {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
    },
  });
}
