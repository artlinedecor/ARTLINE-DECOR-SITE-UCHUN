// ============================================================
// Artline Decor — Telegram Notification Helper
// ============================================================

export async function sendTelegramNotification(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[Telegram] Bot token or chat ID not configured');
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.error('[Telegram] Notification failed:', err);
    return false;
  }
}

export function formatNewLeadMessage(order: {
  clientName: string;
  phone: string;
  address: string;
  totalPrice: number;
}): string {
  return [
    '🏛 <b>ARTLINE DECOR — Yangi Buyurtma!</b>',
    '',
    `👤 <b>Mijoz:</b> ${order.clientName}`,
    `📞 <b>Telefon:</b> ${order.phone}`,
    `📍 <b>Manzil:</b> ${order.address}`,
    `💰 <b>Summa:</b> $${order.totalPrice.toLocaleString()}`,
    '',
    `🕐 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`,
  ].join('\n');
}

export function formatStatusChangeMessage(order: {
  id: string;
  clientName: string;
  phone: string;
  statusText: string;
}): string {
  return [
    '🔄 <b>ARTLINE DECOR — Holat o\'zgardi</b>',
    '',
    `🆔 <b>Buyurtma ID:</b> ${order.id}`,
    `👤 <b>Mijoz:</b> ${order.clientName}`,
    `📞 <b>Telefon:</b> ${order.phone}`,
    '',
    `📌 <b>Yangi Holat:</b> <b>${order.statusText}</b>`,
    '',
    `🕐 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`,
  ].join('\n');
}
