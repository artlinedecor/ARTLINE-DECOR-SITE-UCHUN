// ============================================================
// Artline Decor — PDF Smeta Generator (jsPDF)
// ============================================================
import type { CalculatorResult, Order } from './types';
import { getPricing } from './store';

function cyrillicToLatin(text: string): string {
  if (!text) return '';
  const mapping: { [key: string]: string } = {
    'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
    'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'Yo', 'ё': 'yo', 'Ж': 'J', 'ж': 'j',
    'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
    'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'X', 'х': 'x', 'Ц': 'Ts', 'ц': 'ts',
    'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sh', 'щ': 'sh', 'Ъ': '', 'ъ': '',
    'Ы': 'Y', 'ы': 'y', 'Ь': '', 'ь': '', 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu',
    'Я': 'Ya', 'я': 'ya', 'Ў': "O'", 'ў': "o'", 'Қ': 'Q', 'қ': 'q', 'Ғ': "G'", 'ғ': "g'",
    'Ҳ': 'H', 'ҳ': 'h'
  };
  return text.split('').map(char => mapping[char] ?? char).join('');
}

export async function generateEstimatePDF(
  result: CalculatorResult,
  clientInfo?: { name: string; phone: string; address: string }
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ---- Header ----
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(201, 168, 76); // Gold
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ARTLINE DECOR', margin, 22);

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text('PREMIAL FASAD TIZIMLARI', margin, 30);
  doc.text('3-in-1: Dekor + Izolyatsiya + Himoya', margin, 36);

  // Date
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  const dateStr = new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Sana: ${dateStr}`, pageWidth - margin - 60, 22);
  doc.text(`Smeta #${Date.now().toString(36).toUpperCase()}`, pageWidth - margin - 60, 30);

  // ---- Client Info ----
  let y = 60;
  if (clientInfo) {
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Mijoz:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(cyrillicToLatin(clientInfo.name), margin + 25, y);
    y += 7;
    doc.text(`Tel: ${clientInfo.phone}`, margin, y);
    y += 7;
    doc.text(`Manzil: ${cyrillicToLatin(clientInfo.address)}`, margin, y);
    y += 12;
  }

  // ---- Divider ----
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ---- Items Table ----
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Smeta tafsiloti', margin, y);
  y += 6;

  const tableBody = result.items.map((item, idx) => [
    (idx + 1).toString(),
    cyrillicToLatin(item.name),
    cyrillicToLatin(item.dimensions),
    item.volume > 0 ? `${item.volume} m3` : '-',
    item.quantity.toString(),
    `${item.unitPrice.toLocaleString()} so'm`,
    `${item.totalPrice.toLocaleString()} so'm`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Element', "O'lcham", 'Hajm', 'Soni', 'Birlik narxi', 'Jami']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [10, 10, 15],
      textColor: [201, 168, 76],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
      6: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ---- Totals ----
  const totalsX = pageWidth - margin - 80;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Jami:', totalsX, y);
  doc.text(`${result.subtotal.toLocaleString()} so'm`, totalsX + 65, y, { align: 'right' });
  y += 7;

  doc.setDrawColor(201, 168, 76);
  doc.line(totalsX, y, totalsX + 65, y);
  y += 6;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 10, 15);
  doc.text('UMUMIY:', totalsX, y);
  doc.setTextColor(201, 168, 76);
  doc.text(`${result.total.toLocaleString()} so'm`, totalsX + 65, y, { align: 'right' });

  // ---- Footer ----
  y += 20;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Artline Decor — Premial fasad tizimlari', margin, y);
  y += 5;
  doc.text('Kafolat va Sifat: 10 yil rasmiy sifat kafolati | Ekologik xavfsiz', margin, y);
  y += 5;
  doc.text('Material: PSB-S-25F / PSB-S-35F import xomashyo (Rossiya)', margin, y);
  y += 5;
  doc.text('Montaj: 45° burchakli kesim, 2m profilga 3-4 dona maxsus dyubel bilan mahkamlash', margin, y);

  // Save/Download PDF with robust mobile and Telegram in-app browser fallbacks
  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const isTelegram = /Telegram/i.test(navigator.userAgent);

    if (isMobile || isTelegram) {
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      
      const newTab = window.open(blobUrl, '_blank');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = blobUrl;
      }
    } else {
      doc.save(`Artline_Smeta_${Date.now()}.pdf`);
    }
  } catch (err) {
    console.error("PDF generation/download error, attempting fallback:", err);
    try {
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      window.location.href = blobUrl;
    } catch (fallbackErr) {
      alert("PDF yuklab olishda xatolik yuz berdi. Iltimos, boshqa brauzerda urinib ko'ring.");
    }
  }
}

export async function generateOrderPDF(order: Order): Promise<void> {
  const pricing = getPricing();
  const result = {
    items: order.items.map((item) => {
      const elMeta = pricing.elements.find(el => el.id === item.elementType);
      const isUnit = elMeta ? elMeta.calculationType === 'unit' : false;
      const dimensions = (isUnit && elMeta) ? (elMeta.unit || 'dona') : `${item.length} × ${item.width} × ${item.height} m`;
      const volume = isUnit ? 0 : item.length * item.width * item.height;
      return {
        elementType: item.elementType,
        name: item.name,
        dimensions,
        volume,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      };
    }),
    subtotal: order.totalPrice,
    vat: 0,
    total: order.totalPrice,
  };

  await generateEstimatePDF(result, {
    name: order.clientName,
    phone: order.phone,
    address: order.address,
  });
}
