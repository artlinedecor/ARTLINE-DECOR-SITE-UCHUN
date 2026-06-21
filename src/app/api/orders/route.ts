import { NextResponse } from 'next/server';
import { deleteOrder, getOrders, updateOrderStatus, upsertOrder } from '@/lib/server-data';
import { isAdminRequest } from '@/lib/server-auth';
import type { OrderStatus } from '@/lib/types';

const STATUSES: OrderStatus[] = ['new', 'measurement', 'design', 'sold'];

export async function GET() {
  // Public client portal lookup by id.
  // Full order lists remain admin-only.
  const requestUrl = arguments[0] instanceof Request ? new URL(arguments[0].url) : null;
  const id = requestUrl?.searchParams.get('id');
  if (id) {
    const order = getOrders().find((item) => item.id === id);
    return NextResponse.json({ success: true, order: order || null });
  }

  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ success: true, orders: getOrders() });
}

export async function POST(request: Request) {
  const order = await request.json().catch(() => null);
  if (!order || typeof order !== 'object') {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const orders = upsertOrder(order);
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (
    !payload ||
    typeof payload.id !== 'string' ||
    !STATUSES.includes(payload.status)
  ) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    orders: updateOrderStatus(payload.id, payload.status),
  });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  }

  return NextResponse.json({ success: true, orders: deleteOrder(id) });
}
