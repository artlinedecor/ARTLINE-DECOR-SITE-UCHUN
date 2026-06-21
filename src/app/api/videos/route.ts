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

    const videos = await request.json();
    if (!Array.isArray(videos)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'src', 'lib', 'video-data.ts');
    const fileContent = `import { ShowcaseVideo } from './types';

export const DEFAULT_VIDEOS: ShowcaseVideo[] = ${JSON.stringify(videos, null, 2)};
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
