// ============================================================
// Artline Decor — Type Definitions
// ============================================================

export type OrderStatus = 'new' | 'measurement' | 'design' | 'sold';

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  notes: string;
  objectImages?: string[];
  calcImages?: string[];
}

export interface OrderItem {
  id: string;
  elementType: string;
  name: string;
  length: number;  // meters
  width: number;   // meters
  height: number;  // meters
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type FacadeElementType = string;

export interface FacadeElement {
  id: string;
  nameUz: string;
  nameRu: string;
  description: string;
  rules: string;  // Artline standart qoidalari
  pricePerUnit: number; // in USD
  unit: string;   // m, m², dona
  calculationType: 'volume' | 'unit';
}

export interface PricingConfig {
  pricePerCubicMeter: number;  // Default: 250$
  usdToUzsRate: number;        // USD to UZS exchange rate
  elements: FacadeElement[];
  updatedAt: string;
}

export interface CalculatorInput {
  elementType: string;
  length: number | "";
  width: number | "";
  height: number | "";
  quantity: number | "";
  customPrice?: number | "";
}

export interface CalculatorResult {
  items: CalculatorResultItem[];
  subtotal: number;
  vat: number;
  total: number;
}

export interface CalculatorResultItem {
  elementType: string;
  name: string;
  dimensions: string;
  volume: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface KanbanColumn {
  id: OrderStatus;
  title: string;
  color: string;
  orders: Order[];
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'youtube';
  embedUrl: string;
  title?: string;
  thumbnail?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageCheck: number;
  statusCounts: Record<OrderStatus, number>;
}

// ---- Portfolio ----

export type PortfolioStyle = 'classic' | 'modern' | 'hitech';

export interface PortfolioTestimonial {
  name: string;
  text: string;
  rating: number; // 1-5
}

export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  style: PortfolioStyle;
  description: string;
  completionDays: number;
  area: number; // m²
  elementsUsed: string[];
  benefits: string[];
  images: { src: string; alt: string }[];
  beforeImage?: string;
  afterImage?: string;
  afterVideo?: string;
  testimonial?: PortfolioTestimonial;
  featured: boolean;
}

// ---- Videos ----

export interface ShowcaseVideo {
  id: string;
  title: string;
  desc: string;
  src: string;
  duration: string;
}
