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
}

export interface OrderItem {
  id: string;
  elementType: FacadeElementType;
  name: string;
  length: number;  // meters
  width: number;   // meters
  height: number;  // meters
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type FacadeElementType =
  | 'cornice'    // Karniz
  | 'column'     // Ustun
  | 'pilaster'   // Pilyastr
  | 'archivolt'  // Archivolт
  | 'bracket'    // Kronshteyn
  | 'molding'    // Molding
  | 'rustik'     // Rustik
  | 'medallion'  // Medalyon
  | 'balustrade' // Balyustrada
  | 'keystone';  // Zamkoviy kamen

export interface FacadeElement {
  type: FacadeElementType;
  nameUz: string;
  nameRu: string;
  description: string;
  rules: string;  // Artline standart qoidalari
  pricePerUnit: number;
  unit: string;   // m, m², dona
}

export interface PricingConfig {
  pricePerCubicMeter: number;  // Default: 250$
  elements: Record<FacadeElementType, number>;
  updatedAt: string;
}

export interface CalculatorInput {
  elementType: FacadeElementType;
  length: number;
  width: number;
  height: number;
  quantity: number;
}

export interface CalculatorResult {
  items: CalculatorResultItem[];
  subtotal: number;
  vat: number;
  total: number;
}

export interface CalculatorResultItem {
  elementType: FacadeElementType;
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
