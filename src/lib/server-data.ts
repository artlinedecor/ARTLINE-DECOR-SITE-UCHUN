import fs from 'fs';
import path from 'path';
import type { Order } from './types';

type DataShape = {
  orders: Order[];
};

const DEFAULT_DATA: DataShape = {
  orders: [],
};

function getDataDir(): string {
  if (process.env.VERCEL) {
    return '/tmp';
  }
  return process.env.ARTLINE_DATA_DIR || path.join(process.cwd(), '.artline-data');
}

function getDataPath(): string {
  return path.join(getDataDir(), 'data.json');
}

function readData(): DataShape {
  const dataPath = getDataPath();
  if (!fs.existsSync(dataPath)) return DEFAULT_DATA;

  try {
    return { ...DEFAULT_DATA, ...JSON.parse(fs.readFileSync(dataPath, 'utf-8')) };
  } catch {
    return DEFAULT_DATA;
  }
}

function writeData(data: DataShape): void {
  const dataDir = getDataDir();
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(getDataPath(), JSON.stringify(data, null, 2), 'utf-8');
}

export function getOrders(): Order[] {
  return readData().orders;
}

export function upsertOrder(order: Order): Order[] {
  const data = readData();
  const idx = data.orders.findIndex((item) => item.id === order.id);
  const nextOrder = {
    ...order,
    updatedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    data.orders[idx] = nextOrder;
  } else {
    data.orders.push(nextOrder);
  }

  writeData(data);
  return data.orders;
}

export function updateOrderStatus(id: string, status: Order['status']): Order[] {
  const data = readData();
  const idx = data.orders.findIndex((order) => order.id === id);
  if (idx >= 0) {
    data.orders[idx] = {
      ...data.orders[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    writeData(data);
  }
  return data.orders;
}

export function deleteOrder(id: string): Order[] {
  const data = readData();
  data.orders = data.orders.filter((order) => order.id !== id);
  writeData(data);
  return data.orders;
}
