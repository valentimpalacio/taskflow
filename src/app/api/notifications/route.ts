import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Implement Prisma client to fetch notifications
  // const notifications = await prisma.notification.findMany({
  //   where: { user: { email: session.user.email } },
  //   orderBy: { createdAt: 'desc' },
  //   take: 50,
  // })

  return NextResponse.json([]);
}

// PATCH /api/notifications/[id]/read - Mark notification as read
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing notification ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to update notification
  // const notification = await prisma.notification.update({
  //   where: { id },
  //   data: { read: true },
  // })

  return NextResponse.json({ message: 'Notification marked as read' });
}

// PUT /api/notifications/mark-all-read - Mark all notifications as read
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Implement Prisma client to update all notifications
  // await prisma.notification.updateMany({
  //   where: { user: { email: session.user.email }, read: false },
  //   data: { read: true },
  // })

  return NextResponse.json({
    message: 'All notifications marked as read',
  });
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing notification ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to delete notification
  // await prisma.notification.delete({ where: { id } })

  return NextResponse.json({ message: 'Notification deleted successfully' });
}
