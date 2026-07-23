import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server-auth';
import { getPricingConfig, savePricingConfig } from '@/lib/server-data';
import type { PricingConfig } from '@/lib/types';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const config = getPricingConfig();
  return NextResponse.json({ success: true, config: config || {} });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body: PricingConfig = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const saved = savePricingConfig(body);
  return NextResponse.json({ success: true, config: saved });
}
