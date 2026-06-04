// ============================================================
// Artline Decor — Calculator Logic
// ============================================================
import { CalculatorInput, CalculatorResult, CalculatorResultItem, FacadeElement, FacadeElementType } from './types';
import { getPricing } from './store';

// Facade element metadata — Artline Decor standartlari
export const FACADE_ELEMENTS: Record<FacadeElementType, FacadeElement> = {
  cornice: {
    type: 'cornice',
    nameUz: 'Karniz',
    nameRu: 'Карниз',
    description: 'Bino yuqori qismidagi gorizontal bezak elementi. Tomdan suv oqishini yo\'naltiradi va estetik ko\'rinish beradi.',
    rules: 'Faqat gorizontal chiziqli profil. Artline standartiga ko\'ra vertikal naqsh qo\'yilmaydi.',
    pricePerUnit: 15,
    unit: 'p/m',
  },
  column: {
    type: 'column',
    nameUz: 'Ustun',
    nameRu: 'Колонна',
    description: 'Fasadga ulug\'vorlik va klassik ko\'rinish beradigan vertikal element.',
    rules: 'Faqat silliq (gulsiz) yuzali. Artline standartiga ko\'ra ustunlarga gul naqsh qo\'yilmaydi.',
    pricePerUnit: 25,
    unit: 'dona',
  },
  pilaster: {
    type: 'pilaster',
    nameUz: 'Pilyastr',
    nameRu: 'Пилястр',
    description: 'Devorga yopishtirilgan yassi ustun shaklidagi bezak. Fasadga chuqurlik va ritm beradi.',
    rules: 'Silliq yuzali, karniz bilan birga ishlatiladi.',
    pricePerUnit: 20,
    unit: 'dona',
  },
  archivolt: {
    type: 'archivolt',
    nameUz: 'Archivolт',
    nameRu: 'Архивольт',
    description: 'Arka shaklidagi bezak elementi. Deraza va eshik ustiga o\'rnatiladi.',
    rules: 'Radiusi deraza kengligi bilan mutanosib bo\'lishi kerak.',
    pricePerUnit: 30,
    unit: 'dona',
  },
  bracket: {
    type: 'bracket',
    nameUz: 'Kronshteyn',
    nameRu: 'Кронштейн',
    description: 'Karniz yoki balkonni qo\'llab-quvvatlovchi bezak elementi.',
    rules: 'Har 60-80 sm oraliqda o\'rnatiladi.',
    pricePerUnit: 12,
    unit: 'dona',
  },
  molding: {
    type: 'molding',
    nameUz: 'Molding',
    nameRu: 'Молдинг',
    description: 'Yassi profilli gorizontal bezak chizig\'i. Qavatlarni ajratish uchun ishlatiladi.',
    rules: 'Kengligi 5-15 sm oralig\'ida, qavatlar orasida uzluksiz bo\'lishi kerak.',
    pricePerUnit: 10,
    unit: 'p/m',
  },
  rustik: {
    type: 'rustik',
    nameUz: 'Rustik',
    nameRu: 'Рустик',
    description: 'Bino burchaklaridagi tosh taqlid bezak. Mustahkamlik tuyg\'usini beradi.',
    rules: 'Faqat burchaklarda, galma-gal tartibda joylashtiriladi.',
    pricePerUnit: 18,
    unit: 'dona',
  },
  medallion: {
    type: 'medallion',
    nameUz: 'Medalyon',
    nameRu: 'Медальон',
    description: 'Aylana yoki oval shaklidagi bezak paneli. Fasadga aksent beradi.',
    rules: 'Simmetrik joylashtiriladi, o\'lchami fasad masshtabiga mos.',
    pricePerUnit: 35,
    unit: 'dona',
  },
  balustrade: {
    type: 'balustrade',
    nameUz: 'Balyustrada',
    nameRu: 'Балюстрада',
    description: 'Balkon yoki terrasaning to\'siq panjarasi.',
    rules: 'Balyasinlar orasidagi masofa 12-15 sm, balandligi 90 sm standart.',
    pricePerUnit: 28,
    unit: 'p/m',
  },
  keystone: {
    type: 'keystone',
    nameUz: 'Zamkoviy tosh',
    nameRu: 'Замковый камень',
    description: 'Arka tepasidagi markaziy bezak toshi.',
    rules: 'Faqat arka markazida, archivolт bilan birga ishlatiladi.',
    pricePerUnit: 22,
    unit: 'dona',
  },
};

export function calculateEstimate(inputs: CalculatorInput[]): CalculatorResult {
  const pricing = getPricing();
  const items: CalculatorResultItem[] = inputs.map((input) => {
    const element = FACADE_ELEMENTS[input.elementType];
    const volume = input.length * input.width * input.height;
    const unitPrice = pricing.elements[input.elementType] ?? element.pricePerUnit;
    const totalPrice = volume * pricing.pricePerCubicMeter * input.quantity;

    return {
      elementType: input.elementType,
      name: element.nameUz,
      dimensions: `${input.length} × ${input.width} × ${input.height} m`,
      volume: Math.round(volume * 10000) / 10000,
      quantity: input.quantity,
      unitPrice: pricing.pricePerCubicMeter,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  });

  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const vat = Math.round(subtotal * 0.12 * 100) / 100; // 12% QQS
  const total = Math.round((subtotal + vat) * 100) / 100;

  return { items, subtotal, vat, total };
}
