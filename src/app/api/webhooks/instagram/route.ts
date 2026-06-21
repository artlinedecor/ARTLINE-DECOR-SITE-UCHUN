import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Standard Meta Webhook Verify Token
  if (mode && token) {
    if (mode === 'subscribe' && token === 'artline_verify_token') {
      return new Response(challenge, { status: 200 });
    }
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Empty payload' }, { status: 400 });
    }

    // Extract lead details
    let clientName = body.clientName || 'Instagram Lead';
    let phone = body.phone || '+998 90 000 00 00';
    let address = body.address || 'Instagram Ads';
    let totalPrice = body.totalPrice || 0;
    let notes = body.notes || 'Instagram orqali kelgan lead.';

    // Meta Webhook nested extraction fallback (for actual FB/IG ads webhook connection)
    if (body.entry?.[0]?.changes?.[0]?.value) {
      const changeValue = body.entry[0].changes[0].value;
      clientName = changeValue.lead_name || changeValue.name || clientName;
      phone = changeValue.lead_phone || changeValue.phone || phone;
      address = `Instagram Form: ${changeValue.form_id || 'Instagram Leads'}`;
      notes = `Kompaniya: ${changeValue.campaign_name || 'Instagram Reklama'}`;
    }

    const order = {
      id: 'ig_' + Math.random().toString(36).substring(2, 11),
      clientName,
      phone,
      address,
      totalPrice,
      status: 'new' as const,
      items: [],
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to server database
    const { upsertOrder } = await import('@/lib/server-data');
    upsertOrder(order);

    // Send Telegram Notification
    try {
      const { sendTelegramNotification } = await import('@/lib/telegram');
      const telegramMessage = [
        '<b>🔥 INSTAGRAM ADS - YANGI LEAD!</b>',
        '',
        `<b>Mijoz:</b> ${clientName}`,
        `<b>Telefon:</b> ${phone}`,
        `<b>Manba:</b> ${address}`,
        `<b>Izoh:</b> ${notes}`,
        '',
        `<b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`
      ].join('\n');
      await sendTelegramNotification(telegramMessage);
    } catch (err) {
      console.error('[Instagram Webhook] Telegram notify error:', err);
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Webhook error' }, { status: 500 });
  }
}
