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
  pieceLength?: number;
  customPrice?: number;
}

export type FacadeElementType = string;

export interface FacadeElement {
  id: string;
  nameUz: string;
  nameRu: string;
  description: string;
  rules: string;  // Artline standart qoidalari
  pricePerUnit: number; // in USD
  unit: string;   // m, m², dona, P/M, M²
  calculationType: 'volume' | 'unit';
  width?: number;
  height?: number;
  defaultLength?: number;
  productionCostPerCubicMeter?: number;
  volume?: number;
}

export interface PricingConfig {
  pricePerCubicMeter: number;  // Default: 250$
  usdToUzsRate: number;        // USD to UZS exchange rate
  elements: FacadeElement[];
  updatedAt: string;
}

export interface CalculatorInput {
  elementType: string;
  model?: string;
  length: number | "";
  width: number | "";
  height: number | "";
  quantity: number | "";
  customPrice?: number | "";
  usdPrice?: number | "";
  pieceLength?: number | "";
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

// ---- Inventory & BOM Types ----
export interface InventoryItem {
  id: string;
  name: string;
  type: 'raw' | 'production' | 'finished';
  quantity: number;
  unit: string;
  threshold: number; // Minimum Stock
  cost?: number;
  supplier?: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'inbound' | 'outbound' | 'production_use' | 'correction';
  quantity: number;
  date: string;
  notes: string;
}

export interface BOMMaterialRequirement {
  itemId: string;
  quantityRequired: number;
}

export interface BOMRecipe {
  id: string;
  productId: string;
  materials: BOMMaterialRequirement[];
  steps: string[];
  updatedAt: string;
}

export interface ProductionOrder {
  id: string;
  recipeId: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  notes?: string;
}

// ---- HR & Payroll Types ----
export interface Employee {
  id: string;
  name: string;
  role: string;
  salaryType: 'fixed' | 'piece' | 'kpi';
  rate: number;
  kpiPercent: number;
  active: boolean;
}

export interface AdvancePayment {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  notes: string;
  type?: 'advance' | 'bonus' | 'penalty';
}

export interface WorkLog {
  id: string;
  employeeId: string;
  date: string;
  hoursOrPieces: number;
  description: string;
}

