import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server-auth';

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminRequest() });
}
