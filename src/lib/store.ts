// ============================================================
// Artline Decor — localStorage Store
// ============================================================
import {
  Order,
  PricingConfig,
  FacadeElementType,
  DashboardStats,
  OrderStatus,
} from './types';

const KEYS = {
  ORDERS: 'artline_orders',
  PRICING: 'artline_pricing',
  AUTH: 'artline_auth',
  VIDEOS: 'artline_videos',
} as const;

// Default pricing configuration
const DEFAULT_PRICING: PricingConfig = {
  pricePerCubicMeter: 250,
  elements: {
    cornice: 15,
    column: 25,
    pilaster: 20,
    archivolt: 30,
    bracket: 12,
    molding: 10,
    rustik: 18,
    medallion: 35,
    balustrade: 28,
    keystone: 22,
  },
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
  return getItem<PricingConfig>(KEYS.PRICING, DEFAULT_PRICING);
}

export function savePricing(config: PricingConfig): void {
  setItem(KEYS.PRICING, { ...config, updatedAt: new Date().toISOString() });
}

export function getElementPrice(type: FacadeElementType): number {
  const pricing = getPricing();
  return pricing.elements[type] ?? 0;
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

const DEFAULT_VIDEOS: ShowcaseVideo[] = [
  {
    id: '1',
    title: 'Termo-panellarni stanokda kesish va akril tosh quyish jarayoni',
    desc: 'Bizning seximizda nemis texnologiyasida panellar qanday tayyorlanishi haqida haqiqiy video.',
    src: '/portfolio/video-process-1.mp4',
    duration: 'Sekundlar',
  },
  {
    id: '2',
    title: 'G\'isht ustiga to\'g\'ridan-to\'g\'ri montaj qilish jarayoni',
    desc: 'Suvoqsiz, to\'g\'ridan-to\'g\'ri penopolistirol panellarni fasadga maxsus yelim va dyubellar bilan o\'rnatish.',
    src: '/portfolio/video-process-2.mp4',
    duration: 'Jarayon',
  },
  {
    id: '3',
    title: 'Fasadning tayyor holati (Loyiha yakuni)',
    desc: 'Artline Decor termo-panellari to\'liq montaj qilinib, uyni qanday hashamatli holatga keltirganini ko\'ring.',
    src: '/portfolio/video-process-3.mp4',
    duration: 'Natija',
  }
];

export function getVideos(): ShowcaseVideo[] {
  return getItem<ShowcaseVideo[]>(KEYS.VIDEOS, DEFAULT_VIDEOS);
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

// ---- ID Generator ----

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
