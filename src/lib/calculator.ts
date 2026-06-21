// ============================================================
// Artline Decor — Calculator Logic
// ============================================================
import { CalculatorInput, CalculatorResult, CalculatorResultItem, FacadeElement } from './types';
import { getPricing } from './store';

export function calculateEstimate(inputs: CalculatorInput[]): CalculatorResult {
  const pricing = getPricing();
  const rate = pricing.usdToUzsRate || 12650;

  const items: CalculatorResultItem[] = inputs.map((input) => {
    // Find dynamic element from store, fallback to default if not found
    const element = pricing.elements.find(el => el.id === input.elementType) || {
      id: input.elementType,
      nameUz: input.elementType,
      nameRu: input.elementType,
      description: '',
      rules: '',
      pricePerUnit: 10,
      unit: 'dona',
      calculationType: 'unit' as const
    };

    const length = Number(input.length) || 0;
    const width = Number(input.width) || 0;
    const height = Number(input.height) || 0;
    const quantity = Number(input.quantity) || 0;

    let volume = 0;
    let unitPriceUZS = 0;
    let totalPriceUZS = 0;
    let dimensions = '';

    if (element.calculationType === 'volume') {
      volume = length * width * height;
      unitPriceUZS = Math.round(volume * pricing.pricePerCubicMeter * rate);
      dimensions = `${length}×${width}×${height}m`;
    } else {
      // Unit based (e.g. Termo panel, Montaj)
      volume = 0;
      unitPriceUZS = Math.round(element.pricePerUnit * rate);
      dimensions = element.unit;
    }

    if (input.customPrice !== undefined && input.customPrice !== "" && Number(input.customPrice) >= 0) {
      unitPriceUZS = Number(input.customPrice);
    }
    totalPriceUZS = Math.round(unitPriceUZS * quantity);

    return {
      elementType: input.elementType,
      name: element.nameUz,
      dimensions,
      volume: Math.round(volume * 10000) / 10000,
      quantity,
      unitPrice: unitPriceUZS,
      totalPrice: totalPriceUZS,
    };
  });

  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const vat = 0; // QQS olib tashlangan
  const total = subtotal;

  return { items, subtotal, vat, total };
}
