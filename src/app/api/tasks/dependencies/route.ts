import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimitResult = await checkRateLimit(
    session.user.email,
    'api-task-dependencies',
    50,
    60
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  try {
    const { dependentTaskId, blockingTaskId, type = 'FINISH_TO_START' } = await request.json();

    // Verify both tasks exist and belong to the user
    const [dependentTask, blockingTask] = await Promise.all([
      prisma.task.findFirst({
        where: { 
          id: dependentTaskId,
          project: {
            OR: [
              { userId: session.user.id },
              { projectAccess: { some: { userId: session.user.id } } }
            ]
          }
        }
      }),
      prisma.task.findFirst({
        where: { 
          id: blockingTaskId,
          project: {
            OR: [
              { userId: session.user.id },
              { projectAccess: { some: { userId: session.user.id } } }
            ]
          }
        }
      })
    ]);

    if (!dependentTask || !blockingTask) {
      return NextResponse.json({ error: 'Tasks not found or unauthorized' }, { status: 404 });
    }

    // Prevent circular dependencies
    if (dependentTaskId === blockingTaskId) {
      return NextResponse.json({ error: 'Cannot create circular dependency' }, { status: 400 });
    }

    // Check for existing dependency
    const existingDependency = await prisma.taskDependency.findUnique({
      where: { 
        dependentTaskId_blockingTaskId: { 
          dependentTaskId, 
          blockingTaskId 
        } 
      }
    });

    if (existingDependency) {
      return NextResponse.json({ error: 'Dependency already exists' }, { status: 409 });
    }

    // Create the dependency
    const dependency = await prisma.taskDependency.create({
      data: {
        dependentTaskId,
        blockingTaskId,
        type,
      },
      include: {
        dependentTask: true,
        blockingTask: true,
      }
    });

    return NextResponse.json(dependency, { status: 201 });
  } catch (error) {
    console.error('Error creating task dependency:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
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

  try {
    // Verify the dependency exists and user has access to both tasks
    const dependency = await prisma.taskDependency.findUnique({
      where: { id },
      include: {
        dependentTask: { include: { project: true } },
        blockingTask: { include: { project: true } }
      }
    });

    if (!dependency) {
      return NextResponse.json({ error: 'Dependency not found' }, { status: 404 });
    }

    // Check if user has access to either project
    const hasAccess = 
      dependency.dependentTask.project.userId === session.user.id ||
      dependency.blockingTask.project.userId === session.user.id ||
      (await prisma.projectAccess.findFirst({
        where: {
          OR: [
            { projectId: dependency.dependentTask.projectId, userId: session.user.id },
            { projectId: dependency.blockingTask.projectId, userId: session.user.id }
          ]
        }
      })) !== null;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.taskDependency.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task dependency:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}