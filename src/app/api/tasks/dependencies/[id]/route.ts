import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
