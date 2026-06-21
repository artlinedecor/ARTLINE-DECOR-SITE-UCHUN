// ============================================================
// Artline Decor — localStorage Store
// ============================================================
import {
  Order,
  PricingConfig,
  FacadeElementType,
  DashboardStats,
  OrderStatus,
  PortfolioProject,
} from './types';
import { PORTFOLIO_PROJECTS } from './portfolio-data';

const KEYS = {
  ORDERS: 'artline_orders',
  PRICING: 'artline_pricing',
  AUTH: 'artline_auth',
  VIDEOS: 'artline_videos',
  PORTFOLIO: 'artline_portfolio',
} as const;

// Default pricing configuration
export const DEFAULT_PRICING: PricingConfig = {
  pricePerCubicMeter: 250,
  usdToUzsRate: 12650,
  elements: [
    {
      id: 'cornice',
      nameUz: 'Karniz',
      nameRu: 'Карниз',
      description: 'Tom va fasad tutashgan joylar uchun dekorativ karniz',
      rules: 'Tom osti qismiga o\'rnatiladi. Standart uzunlik — 2m.',
      pricePerUnit: 15,
      unit: 'P/M',
      calculationType: 'volume'
    },
    {
      id: 'column',
      nameUz: 'Ustun',
      nameRu: 'Колонна',
      description: 'Bino kirish qismi va dahlizlar uchun klassik ustunlar',
      rules: 'Tayanch va dekorativ maqsadlarda ishlatiladi.',
      pricePerUnit: 25,
      unit: 'DONA',
      calculationType: 'volume'
    },
    {
      id: 'pilaster',
      nameUz: 'Pilyastr',
      nameRu: 'Пилястра',
      description: 'Fasad devorlarining tekis yuzasini bezash uchun yassi ustun',
      rules: 'Deraza atrofida yoki burchaklarda devorga yopishtiriladi.',
      pricePerUnit: 20,
      unit: 'DONA',
      calculationType: 'volume'
    },
    {
      id: 'archivolt',
      nameUz: 'Archivolt',
      nameRu: 'Архивольт',
      description: 'Deraza va eshik arkalarini bezash uchun dekorativ profil',
      rules: 'Yarim doira yoki murakkab shakldagi arkalarda ishlatiladi.',
      pricePerUnit: 30,
      unit: 'P/M',
      calculationType: 'volume'
    },
    {
      id: 'bracket',
      nameUz: 'Kronshteyn',
      nameRu: 'Кронштейн',
      description: 'Karnizlar, tokchalar yoki deraza oynalari ostidagi tayanch',
      rules: 'Karnizlarning ostki qismiga yoki dahliz burchaklariga qotiriladi.',
      pricePerUnit: 12,
      unit: 'DONA',
      calculationType: 'volume'
    },
    {
      id: 'molding',
      nameUz: 'Molding',
      nameRu: 'Молдинг',
      description: 'Fasad yuzasida ramkalar va chiziqlar yaratish uchun profil',
      rules: 'Devor sirtidagi rang va material o\'tish joylarini yopish uchun.',
      pricePerUnit: 10,
      unit: 'P/M',
      calculationType: 'volume'
    },
    {
      id: 'rustik',
      nameUz: 'Rustik',
      nameRu: 'Рустик',
      description: 'Bino burchaklarini bezash va himoya qilish uchun burchak toshlari',
      rules: 'Binoning tashqi burchaklariga shaxmat yoki ketma-ket tartibda o\'rnatiladi.',
      pricePerUnit: 18,
      unit: 'DONA',
      calculationType: 'volume'
    },
    {
      id: 'medallion',
      nameUz: 'Medalyon',
      nameRu: 'Медальон',
      description: 'Fasadning markaziy yoki yuqori qismidagi doiraviy dekorativ element',
      rules: 'Fasadning eng ko\'zga tashlanadigan qismiga qotiriladi.',
      pricePerUnit: 35,
      unit: 'DONA',
      calculationType: 'volume'
    },
    {
      id: 'balustrade',
      nameUz: 'Balyustrada',
      nameRu: 'Балюстрада',
      description: 'Zinapoyalar, balkonlar va terrasalar uchun dekorativ to\'siqlar',
      rules: 'Alohida ustunchalar yordamida yig\'iladi. Mustahkam asos talab qiladi.',
      pricePerUnit: 28,
      unit: 'DONA',
      calculationType: 'volume'
    },
    {
      id: 'keystone',
      nameUz: 'Zamkoviy kamen',
      nameRu: 'Замковый камень',
      description: 'Arka yoki deraza tepasidagi markaziy dekorativ tosh',
      rules: 'Deraza profili yoki arkaning markaziy yuqori nuqtasiga o\'rnatiladi.',
      pricePerUnit: 22,
      unit: 'DONA',
      calculationType: 'volume'
    },
    {
      id: 'termopanel_3sm',
      nameUz: 'Termo panel - 3sm',
      nameRu: 'Термопанель - 3см',
      description: 'Issiqlik izolyatsiyasi va fasad bezagi uchun dekorativ panel',
      rules: 'Fasad devorlariga yopishtirilib, mustahkamlanadi.',
      pricePerUnit: 7.9,
      unit: 'M²',
      calculationType: 'unit'
    },
    {
      id: 'montaj',
      nameUz: 'Montaj xizmati',
      nameRu: 'Услуги монтажа',
      description: 'Termo panel va dekorativ elementlarni o\'rnatish',
      rules: 'Tashqi fasad montaj ishlari.',
      pricePerUnit: 5.53,
      unit: 'M²',
      calculationType: 'unit'
    },
    {
      id: 'imulsiya',
      nameUz: 'Bo\'yash (Imulsiya)',
      nameRu: 'Покраска (Эмульсия)',
      description: 'Fasad yuzasini bo\'yoq va emulsiya bilan qoplash',
      rules: 'Tashqi fasad bo\'yash ishlari.',
      pricePerUnit: 0.95,
      unit: 'M²',
      calculationType: 'unit'
    }
  ],
  updatedAt: new Date().toISOString(),
};

// ---- Helpers ----

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Orders ----

export function getOrders(): Order[] {
  return getItem<Order[]>(KEYS.ORDERS, []);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return getOrders().filter((o) => o.status === status);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = { ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.push(order);
  }
  setItem(KEYS.ORDERS, orders);
}

export function deleteOrder(id: string): void {
  setItem(
    KEYS.ORDERS,
    getOrders().filter((o) => o.id !== id)
  );
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    setItem(KEYS.ORDERS, orders);
  }
}

// ---- Pricing ----

export function getPricing(): PricingConfig {
  const pricing = getItem<PricingConfig>(KEYS.PRICING, DEFAULT_PRICING);
  if (typeof pricing.usdToUzsRate === 'undefined') {
    pricing.usdToUzsRate = DEFAULT_PRICING.usdToUzsRate;
  }
  // Robust migration: convert legacy Record elements to dynamic Array elements
  if (!pricing.elements || !Array.isArray(pricing.elements)) {
    const legacy = (pricing.elements || {}) as Record<string, number>;
    pricing.elements = DEFAULT_PRICING.elements.map(def => {
      const price = legacy[def.id];
      return price !== undefined ? { ...def, pricePerUnit: price } : def;
    });
  }
  return pricing;
}

export function savePricing(config: PricingConfig): void {
  setItem(KEYS.PRICING, { ...config, updatedAt: new Date().toISOString() });
}

export function getElementPrice(type: string): number {
  const pricing = getPricing();
  if (Array.isArray(pricing.elements)) {
    const found = pricing.elements.find(el => el.id === type);
    return found ? found.pricePerUnit : 0;
  }
  const legacy = pricing.elements as unknown as Record<string, number>;
  return legacy[type] ?? 0;
}

// ---- Auth ----

export function isAuthenticated(): boolean {
  return getItem<boolean>(KEYS.AUTH, false);
}

export function setAuthenticated(val: boolean): void {
  setItem(KEYS.AUTH, val);
}

// ---- Stats ----

export function getDashboardStats(): DashboardStats {
  const orders = getOrders();
  const sold = orders.filter((o) => o.status === 'sold');
  const totalRevenue = sold.reduce((s, o) => s + o.totalPrice, 0);
  return {
    totalOrders: orders.length,
    totalRevenue,
    averageCheck: sold.length > 0 ? totalRevenue / sold.length : 0,
    statusCounts: {
      new: orders.filter((o) => o.status === 'new').length,
      measurement: orders.filter((o) => o.status === 'measurement').length,
      design: orders.filter((o) => o.status === 'design').length,
      sold: sold.length,
    },
  };
}

// ---- Videos ----

import { ShowcaseVideo } from './types';
import { DEFAULT_VIDEOS } from './video-data';

export function getVideos(): ShowcaseVideo[] {
  const localVideos = getItem<ShowcaseVideo[]>(KEYS.VIDEOS, []);
  if (localVideos.length === 0) {
    return DEFAULT_VIDEOS;
  }
  let updated = false;
  const mergedVideos = [...localVideos];
  for (const defVid of DEFAULT_VIDEOS) {
    if (!mergedVideos.some((v) => v.id === defVid.id)) {
      mergedVideos.push(defVid);
      updated = true;
    }
  }
  if (updated) {
    setItem(KEYS.VIDEOS, mergedVideos);
  }
  return mergedVideos;
}

export function saveVideo(video: ShowcaseVideo): void {
  const videos = getVideos();
  const idx = videos.findIndex((v) => v.id === video.id);
  if (idx >= 0) {
    videos[idx] = video;
  } else {
    videos.push(video);
  }
  setItem(KEYS.VIDEOS, videos);
}

export function deleteVideo(id: string): void {
  setItem(
    KEYS.VIDEOS,
    getVideos().filter((v) => v.id !== id)
  );
}

// ---- Portfolio ----

export function getPortfolioProjects(): PortfolioProject[] {
  const localProjects = getItem<PortfolioProject[]>(KEYS.PORTFOLIO, []);
  if (localProjects.length === 0) {
    return PORTFOLIO_PROJECTS;
  }
  let updated = false;
  const mergedProjects = [...localProjects];
  for (const defProj of PORTFOLIO_PROJECTS) {
    if (!mergedProjects.some((p) => p.id === defProj.id)) {
      mergedProjects.push(defProj);
      updated = true;
    }
  }
  if (updated) {
    setItem(KEYS.PORTFOLIO, mergedProjects);
  }
  return mergedProjects;
}

export function savePortfolioProject(project: PortfolioProject): void {
  const projects = getPortfolioProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  setItem(KEYS.PORTFOLIO, projects);
}

export function deletePortfolioProject(id: string): void {
  setItem(
    KEYS.PORTFOLIO,
    getPortfolioProjects().filter((p) => p.id !== id)
  );
}

// ---- ID Generator ----

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
