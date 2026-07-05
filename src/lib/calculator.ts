// ============================================================
// Artline Decor — Calculator Logic
// ============================================================
import { CalculatorInput, CalculatorResult, CalculatorResultItem, FacadeElement } from './types';
import { getPricing } from './store';

export function generateModelCode(elementType: string, height: number, width: number): string {
  const hSm = Math.round(height * 100);
  const wSm = Math.round(width * 100);
  if (!hSm || !wSm) return '';
  
  let prefix = '';
  switch (elementType) {
    case 'cornice':
      prefix = 'KRZ';
      break;
    case 'molding':
      prefix = 'NL';
      break;
    case 'podokonik':
      prefix = 'PDK';
      break;
    case 'termopanel_3sm':
    case 'termopanel_5sm':
      prefix = 'PAN';
      break;
    case 'column':
      prefix = 'KLN';
      break;
    case 'pilaster':
      prefix = 'PL';
      break;
    case 'archivolt':
      prefix = 'AR';
      break;
    case 'bracket':
      prefix = 'KB';
      break;
    case 'rustik':
      prefix = 'RT';
      break;
    case 'medallion':
      prefix = 'MD';
      break;
    case 'balustrade':
      prefix = 'BL';
      break;
    case 'keystone':
      prefix = 'ZK';
      break;
    default:
      return '';
  }
  return `${prefix} ${hSm}${wSm}`;
}

export function calculateEstimate(inputs: CalculatorInput[], globalCostPerCubic?: number, customRate?: number): CalculatorResult {
  const pricing = getPricing();
  const rate = customRate !== undefined ? customRate : (pricing.usdToUzsRate || 12650);
  const baseCostPerCubic = globalCostPerCubic !== undefined ? globalCostPerCubic : (pricing.pricePerCubicMeter || 250);

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

    const width = Number(input.width) || 0;
    const height = Number(input.height) || 0;
    // input.length represents the total ordered meters ("Buyurtma Metri")
    const totalMeters = Number(input.length) || 0;

    let volume = 0;
    let unitPriceUZS = 0;
    let totalPriceUZS = 0;
    let dimensions = '';
    const unit = (element.unit || 'dona').toUpperCase();

    if (element.calculationType === 'volume') {
      const costPerCubic = (input.usdPrice !== undefined && input.usdPrice !== "" && Number(input.usdPrice) >= 0)
        ? Number(input.usdPrice)
        : baseCostPerCubic;
      
      // Volume of exactly 1 meter = 1 * width * height
      const oneMeterVolume = 1 * width * height;
      volume = totalMeters * width * height; // Total volume
      
      unitPriceUZS = Math.round(oneMeterVolume * costPerCubic * rate);
      const defaultL = input.pieceLength !== undefined && input.pieceLength !== "" ? Number(input.pieceLength) : (element.defaultLength || 2.0);
      const wCm = Math.round(width * 100);
      const hCm = Math.round(height * 100);
      dimensions = `(${defaultL} metr uzunlik, devordan bo'rtib chiqishi ${hCm} sm, yuzasi balandligi ${wCm} sm)`;
    } else {
      // Unit-based (e.g. Termo panel, Montaj)
      volume = 0;
      const basePriceUSD = (input.usdPrice !== undefined && input.usdPrice !== "" && Number(input.usdPrice) >= 0)
        ? Number(input.usdPrice)
        : (element.pricePerUnit || 0);
      unitPriceUZS = Math.round(basePriceUSD * rate);
      dimensions = element.unit;
    }

    if (input.customPrice !== undefined && input.customPrice !== "" && Number(input.customPrice) >= 0) {
      unitPriceUZS = Number(input.customPrice);
    }

    // Total price is simply unitPrice (price of 1m or 1 unit) * totalMeters (quantity)
    totalPriceUZS = Math.round(unitPriceUZS * totalMeters);

    // Auto-generate model code if not provided by user
    const autoModel = generateModelCode(input.elementType, height, width);
    const displayName = input.model && input.model.trim() !== ""
      ? input.model
      : (autoModel || element.nameUz);

    return {
      elementType: input.elementType,
      name: displayName,
      dimensions,
      volume: Math.round(volume * 10000) / 10000,
      quantity: totalMeters, // total quantity/meters
      unitPrice: unitPriceUZS,
      totalPrice: totalPriceUZS,
    };
  });

  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const vat = 0; // QQS olib tashlangan
  const total = subtotal;

  return { items, subtotal, vat, total };
}
