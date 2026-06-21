import { NextResponse } from 'next/server';
import { 
  sendTelegramNotification, 
  formatNewLeadMessage, 
  formatStatusChangeMessage, 
  formatEstimateModalMessage 
} from '@/lib/telegram';
import { isAdminRequest } from '@/lib/server-auth';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    let message = '';
    
    if (payload.type === 'status_change') {
      if (!(await isAdminRequest())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      message = formatStatusChangeMessage(payload.order);
    } else if (payload.type === 'estimate_modal') {
      message = formatEstimateModalMessage(payload);
    } else {
      message = formatNewLeadMessage(payload);
    }

    const success = await sendTelegramNotification(message);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}
