import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAdminRequest } from '@/lib/server-auth';

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await request.json();
    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'src', 'lib', 'portfolio-data.ts');
    const fileContent = `// ============================================================
// Artline Decor - Portfolio Data (Auto-generated via dashboard)
// ============================================================
import type { PortfolioProject, PortfolioStyle } from './types';

export const STYLE_LABELS: Record<PortfolioStyle, { uz: string; ru: string; color: string }> = {
  classic: { uz: 'Klassik', ru: 'Klassicheskiy', color: '#c0835a' },
  modern:  { uz: 'Zamonaviy', ru: 'Sovremenniy', color: '#60a5fa' },
  hitech:  { uz: 'Hi-Tech', ru: 'Hi-Tech', color: '#34d399' },
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = ${JSON.stringify(projects, null, 2)};
`;

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
