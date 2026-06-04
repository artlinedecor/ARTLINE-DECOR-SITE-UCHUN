import { NextResponse } from 'next/server';
import { sendTelegramNotification, formatNewLeadMessage, formatStatusChangeMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    let message = '';
    
    if (payload.type === 'status_change') {
      message = formatStatusChangeMessage(payload.order);
    } else {
      message = formatNewLeadMessage(payload);
    }

    const success = await sendTelegramNotification(message);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}
