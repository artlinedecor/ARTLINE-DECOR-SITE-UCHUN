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
    const webhookVal = body.entry?.[0]?.changes?.[0]?.value;
    if (webhookVal) {
      const leadgenId = webhookVal.leadgen_id;
      const accessToken = process.env.META_ACCESS_TOKEN;
      
      clientName = webhookVal.lead_name || webhookVal.name || clientName;
      phone = webhookVal.lead_phone || webhookVal.phone || phone;
      address = `Instagram Form: ${webhookVal.form_id || 'Instagram Leads'}`;
      notes = `Kompaniya: ${webhookVal.campaign_name || 'Instagram Reklama'}`;

      if (leadgenId && accessToken) {
        try {
          const fbRes = await fetch(`https://graph.facebook.com/v20.0/${leadgenId}?access_token=${accessToken}`);
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            if (fbData.field_data) {
              const nameField = fbData.field_data.find((f: any) => 
                f.name === 'full_name' || f.name === 'name' || f.name.toLowerCase().includes('name')
              );
              const phoneField = fbData.field_data.find((f: any) => 
                f.name === 'phone_number' || f.name === 'phone' || f.name.toLowerCase().includes('phone')
              );
              
              if (nameField?.values?.[0]) {
                clientName = nameField.values[0];
              }
              if (phoneField?.values?.[0]) {
                phone = phoneField.values[0];
              }

              // Extract other fields/answers if any
              const customFields = fbData.field_data
                .filter((f: any) => f.name !== 'full_name' && f.name !== 'phone_number')
                .map((f: any) => `${f.name}: ${f.values?.join(', ')}`)
                .join('\n');
              if (customFields) {
                notes = `${notes}\n\nQo'shimcha ma'lumotlar:\n${customFields}`;
              }
            }
          } else {
            console.error('[Instagram Webhook] Meta Graph API error response:', await fbRes.text());
          }
        } catch (fbErr) {
          console.error('[Instagram Webhook] Fetching lead details from Meta failed:', fbErr);
        }
      }
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
