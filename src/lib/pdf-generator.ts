// ============================================================
// Artline Decor — PDF Smeta Generator (jsPDF)
// ============================================================
import type { CalculatorResult, Order } from './types';

export async function generateEstimatePDF(
  result: CalculatorResult,
  clientInfo?: { name: string; phone: string; address: string }
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

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
    doc.text(clientInfo.name, margin + 25, y);
    y += 7;
    doc.text(`Tel: ${clientInfo.phone}`, margin, y);
    y += 7;
    doc.text(`Manzil: ${clientInfo.address}`, margin, y);
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
    item.name,
    item.dimensions,
    `${item.volume} m³`,
    item.quantity.toString(),
    `$${item.unitPrice}`,
    `$${item.totalPrice.toLocaleString()}`,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).autoTable({
    startY: y,
    head: [['#', 'Element', "O'lcham", 'Hajm', 'Soni', 'Narx/m³', 'Jami']],
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // ---- Totals ----
  const totalsX = pageWidth - margin - 70;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Jami:', totalsX, y);
  doc.text(`$${result.subtotal.toLocaleString()}`, totalsX + 55, y, { align: 'right' });
  y += 7;

  doc.text('QQS (12%):', totalsX, y);
  doc.text(`$${result.vat.toLocaleString()}`, totalsX + 55, y, { align: 'right' });
  y += 7;

  doc.setDrawColor(201, 168, 76);
  doc.line(totalsX, y, totalsX + 55, y);
  y += 6;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 10, 15);
  doc.text('UMUMIY:', totalsX, y);
  doc.setTextColor(201, 168, 76);
  doc.text(`$${result.total.toLocaleString()}`, totalsX + 55, y, { align: 'right' });

  // ---- Footer ----
  y += 20;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Artline Decor — 10 yillik kafolat bilan premial fasad tizimlari', margin, y);
  y += 5;
  doc.text('Material: PSB-S-25F / PSB-S-35F import xomashyo | Ekologik xavfsiz', margin, y);
  y += 5;
  doc.text('Montaj: 45° burchakli kesim, 2m ga 3-4 dona dyubel bilan mahkamlash', margin, y);
  y += 5;
  doc.text('Buyurtma tayyorligi: 1-3 ish kuni', margin, y);

  // Save
  doc.save(`Artline_Smeta_${Date.now()}.pdf`);
}

export async function generateOrderPDF(order: Order): Promise<void> {
  const result = {
    items: order.items.map((item) => ({
      elementType: item.elementType,
      name: item.name,
      dimensions: `${item.length} × ${item.width} × ${item.height} m`,
      volume: item.length * item.width * item.height,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    subtotal: order.totalPrice / 1.12,
    vat: order.totalPrice - order.totalPrice / 1.12,
    total: order.totalPrice,
  };

  await generateEstimatePDF(result, {
    name: order.clientName,
    phone: order.phone,
    address: order.address,
  });
}
