import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAdminRequest } from '@/lib/server-auth';

function getConfigPath(): string {
  const dir = process.env.ARTLINE_DATA_DIR || path.join(process.cwd(), '.artline-data');
  return path.join(dir, 'config.json');
}

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    return NextResponse.json({ success: true, config: {} });
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return NextResponse.json({ success: true, config });
  } catch {
    return NextResponse.json({ success: true, config: {} });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);
  fs.mkdirSync(configDir, { recursive: true });

  let existing = {};
  if (fs.existsSync(configPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {}
  }

  const updated = {
    ...existing,
    ...body,
  };

  fs.writeFileSync(configPath, JSON.stringify(updated, null, 2), 'utf-8');
  return NextResponse.json({ success: true, config: updated });
}
