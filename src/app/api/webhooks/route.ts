import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

// GET /api/webhooks?projectId=... - Get project webhooks
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

  // TODO: Implement Prisma client to fetch webhooks
  // const webhooks = await prisma.webhook.findMany({
  //   where: { projectId },
  // })

  return NextResponse.json([]);
}

// POST /api/webhooks - Create webhook
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, url, events } = await request.json();

  if (!projectId || !url || !events || events.length === 0) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Generate secret for HMAC verification
  const secret = crypto.randomBytes(32).toString('hex');

  // TODO: Implement Prisma client to create webhook
  // const webhook = await prisma.webhook.create({
  //   data: {
  //     projectId,
  //     userId: session.user.id,
  //     url,
  //     events,
  //     secret,
  //   },
  // })

  return NextResponse.json(
    { message: 'Webhook created successfully', id: 'temp-id', secret },
    { status: 201 }
  );
}

// PUT /api/webhooks/[id] - Update webhook
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const { active, url, events } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Missing webhook ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to update webhook

  return NextResponse.json({ message: 'Webhook updated successfully' });
}

// DELETE /api/webhooks/[id] - Delete webhook
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing webhook ID' },
      { status: 400 }
    );
  }

  // TODO: Implement Prisma client to delete webhook

  return NextResponse.json({ message: 'Webhook deleted successfully' });
}

/**
 * Helper function to send webhook events
 * This should be called internally when events occur
 */
export async function triggerWebhook(
  projectId: string,
  event: string,
  data: any
) {
  // TODO: Implement webhook triggering logic
  // 1. Get all active webhooks for the project
  // 2. For each webhook that listens to this event:
  //    - Create HMAC signature
  //    - Send POST request to webhook URL with event data
  //    - Update lastTriggered timestamp
  //    - Handle retry logic for failures
}
