import fs from 'fs';
import path from 'path';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMoney(value: unknown): string {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString('uz-UZ') : '0';
}

function getSavedConfig() {
  try {
    const dir = process.env.ARTLINE_DATA_DIR || path.join(process.cwd(), '.artline-data');
    const configPath = path.join(dir, 'config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch {}
  return {};
}

export async function sendTelegramNotification(message: string): Promise<boolean> {
  const config = getSavedConfig();
  const token = config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = config.telegramChatId || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[Telegram] Bot token or chat ID not configured');
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
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
    '<b>ARTLINE DECOR - Yangi Buyurtma!</b>',
    '',
    `<b>Mijoz:</b> ${escapeHtml(order.clientName)}`,
    `<b>Telefon:</b> ${escapeHtml(order.phone)}`,
    `<b>Manzil:</b> ${escapeHtml(order.address)}`,
    `<b>Summa:</b> $${formatMoney(order.totalPrice)}`,
    '',
    `<b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`,
  ].join('\n');
}

export function formatStatusChangeMessage(order: {
  id: string;
  clientName: string;
  phone: string;
  statusText: string;
}): string {
  return [
    '<b>ARTLINE DECOR - Holat o\'zgardi</b>',
    '',
    `<b>Buyurtma ID:</b> ${escapeHtml(order.id)}`,
    `<b>Mijoz:</b> ${escapeHtml(order.clientName)}`,
    `<b>Telefon:</b> ${escapeHtml(order.phone)}`,
    '',
    `<b>Yangi Holat:</b> <b>${escapeHtml(order.statusText)}</b>`,
    '',
    `<b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`,
  ].join('\n');
}

export function formatEstimateModalMessage(lead: {
  clientName: string;
  phone: string;
  city: string;
  area: string;
  buildingType: string;
  userRole: string;
}): string {
  return [
    '<b>ARTLINE DECOR - Yangi Smeta So\'rovi!</b>',
    '',
    `<b>Mijoz:</b> ${escapeHtml(lead.clientName)}`,
    `<b>Telefon:</b> ${escapeHtml(lead.phone)}`,
    `<b>Shahar/Viloyat:</b> ${escapeHtml(lead.city)}`,
    `<b>Taxminiy maydon:</b> ${escapeHtml(lead.area)} m2`,
    `<b>Bino turi:</b> ${escapeHtml(lead.buildingType)}`,
    `<b>Rol:</b> ${escapeHtml(lead.userRole)}`,
    '',
    `<b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`,
  ].join('\n');
}
