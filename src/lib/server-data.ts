import fs from 'fs';
import path from 'path';
import type { 
  Order, 
  InventoryItem, 
  InventoryTransaction, 
  BOMRecipe, 
  ProductionOrder, 
  Employee, 
  AdvancePayment, 
  WorkLog 
} from './types';

type DataShape = {
  orders: Order[];
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  boms: BOMRecipe[];
  productionOrders: ProductionOrder[];
  employees: Employee[];
  advances: AdvancePayment[];
  workLogs: WorkLog[];
};

const DEFAULT_DATA: DataShape = {
  orders: [],
  inventory: [
    { id: 'inv_1', name: 'Penoplast 25 zichlik (3sm)', type: 'raw', quantity: 150, unit: 'm³', threshold: 30 },
    { id: 'inv_2', name: 'Suyuq shpatlyovka (grunt)', type: 'raw', quantity: 800, unit: 'kg', threshold: 200 },
    { id: 'inv_3', name: 'Klinker g\'isht (kulrang)', type: 'raw', quantity: 4500, unit: 'dona', threshold: 1000 },
    { id: 'inv_4', name: 'Klinker g\'isht (qizil)', type: 'raw', quantity: 3200, unit: 'dona', threshold: 1000 },
    { id: 'inv_5', name: 'Yelim (Kley)', type: 'raw', quantity: 600, unit: 'kg', threshold: 150 },
    { id: 'inv_6', name: 'Karniz K-12 (Tayyor)', type: 'finished', quantity: 120, unit: 'm', threshold: 50 },
    { id: 'inv_7', name: 'Molding M-05 (Tayyor)', type: 'finished', quantity: 240, unit: 'm', threshold: 80 },
    { id: 'inv_8', name: 'Termo panel - 3sm (Tayyor)', type: 'finished', quantity: 450, unit: 'm²', threshold: 100 }
  ],
  transactions: [
    { id: 'tx_1', itemId: 'inv_1', type: 'inbound', quantity: 50, date: new Date(Date.now() - 5*86400000).toISOString(), notes: 'Yangi partiya penoplast olindi' },
    { id: 'tx_2', itemId: 'inv_2', type: 'inbound', quantity: 300, date: new Date(Date.now() - 4*86400000).toISOString(), notes: 'Suyuq shpatlyovka sotib olindi' }
  ],
  boms: [
    {
      id: 'bom_termopanel_3sm',
      productId: 'termopanel_3sm',
      materials: [
        { itemId: 'inv_1', quantityRequired: 0.03 }, // 0.03 m3 penoplast per m2
        { itemId: 'inv_2', quantityRequired: 2.2 },   // 2.2 kg shpatlyovka per m2
        { itemId: 'inv_3', quantityRequired: 16 }     // 16 pieces klinker brick per m2
      ],
      steps: [
        'Penoplastni 3sm qalinlikda tayyorlash va kesish.',
        'Suyuq shpatlyovka qatlamini surtish.',
        'Klinker g\'ishtlarni qolip bo\'yicha joylashtirish.',
        'Qurish xonasida 24 soat davomida quritish.'
      ],
      updatedAt: new Date().toISOString()
    }
  ],
  productionOrders: [],
  employees: [
    { id: 'emp_1', name: 'Elyor (Menejer)', role: 'Savdo Menejeri', salaryType: 'kpi', rate: 2000000, kpiPercent: 2, active: true },
    { id: 'emp_2', name: 'Jasur (Zamerchi)', role: 'O\'lchovchi (Zamer)', salaryType: 'fixed', rate: 4500000, kpiPercent: 0, active: true },
    { id: 'emp_3', name: 'Doston (Usta)', role: 'Ishlab chiqarish ustasi', salaryType: 'piece', rate: 25000, kpiPercent: 0, active: true }
  ],
  advances: [
    { id: 'adv_1', employeeId: 'emp_3', amount: 500000, date: new Date(Date.now() - 3*86400000).toISOString(), notes: 'Avans berildi' }
  ],
  workLogs: [
    { id: 'wl_1', employeeId: 'emp_3', date: new Date(Date.now() - 2*86400000).toISOString(), hoursOrPieces: 40, description: '40 ta termopanel tayyorlandi' }
  ]
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
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      orders: parsed.orders || [],
      inventory: parsed.inventory || DEFAULT_DATA.inventory,
      transactions: parsed.transactions || DEFAULT_DATA.transactions,
      boms: parsed.boms || DEFAULT_DATA.boms,
      productionOrders: parsed.productionOrders || DEFAULT_DATA.productionOrders,
      employees: parsed.employees || DEFAULT_DATA.employees,
      advances: parsed.advances || DEFAULT_DATA.advances,
      workLogs: parsed.workLogs || DEFAULT_DATA.workLogs,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

function writeData(data: DataShape): void {
  const dataDir = getDataDir();
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(getDataPath(), JSON.stringify(data, null, 2), 'utf-8');
}

// ---- Orders ----
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

// ---- Inventory ----
export function getInventory(): InventoryItem[] {
  return readData().inventory;
}

export function upsertInventoryItem(item: InventoryItem): InventoryItem[] {
  const data = readData();
  const idx = data.inventory.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    data.inventory[idx] = item;
  } else {
    data.inventory.push(item);
  }
  writeData(data);
  return data.inventory;
}

export function deleteInventoryItem(id: string): InventoryItem[] {
  const data = readData();
  data.inventory = data.inventory.filter(i => i.id !== id);
  writeData(data);
  return data.inventory;
}

// ---- Transactions ----
export function getTransactions(): InventoryTransaction[] {
  return readData().transactions;
}

export function addTransaction(tx: InventoryTransaction): InventoryTransaction[] {
  const data = readData();
  data.transactions.push(tx);
  
  // Adjust inventory quantity based on transaction type
  const item = data.inventory.find(i => i.id === tx.itemId);
  if (item) {
    if (tx.type === 'inbound') {
      item.quantity += tx.quantity;
    } else if (tx.type === 'outbound' || tx.type === 'production_use') {
      item.quantity = Math.max(0, item.quantity - tx.quantity);
    } else if (tx.type === 'correction') {
      item.quantity = Math.max(0, tx.quantity); // Correction sets absolute quantity
    }
  }
  
  writeData(data);
  return data.transactions;
}

// ---- BOM Recipes ----
export function getBOMs(): BOMRecipe[] {
  return readData().boms;
}

export function upsertBOM(bom: BOMRecipe): BOMRecipe[] {
  const data = readData();
  const idx = data.boms.findIndex(b => b.id === bom.id);
  const nextBOM = {
    ...bom,
    updatedAt: new Date().toISOString()
  };
  if (idx >= 0) {
    data.boms[idx] = nextBOM;
  } else {
    data.boms.push(nextBOM);
  }
  writeData(data);
  return data.boms;
}

export function deleteBOM(id: string): BOMRecipe[] {
  const data = readData();
  data.boms = data.boms.filter(b => b.id !== id);
  writeData(data);
  return data.boms;
}

// ---- Production Orders ----
export function getProductionOrders(): ProductionOrder[] {
  return readData().productionOrders;
}

export function upsertProductionOrder(po: ProductionOrder): { productionOrders: ProductionOrder[], inventory: InventoryItem[] } {
  const data = readData();
  const idx = data.productionOrders.findIndex(p => p.id === po.id);
  
  // Check if status is transitioning to 'completed'
  const oldPo = idx >= 0 ? data.productionOrders[idx] : null;
  const isCompleting = po.status === 'completed' && (!oldPo || oldPo.status !== 'completed');

  if (idx >= 0) {
    data.productionOrders[idx] = po;
  } else {
    data.productionOrders.push(po);
  }

  // If completing, consume raw materials and output finished product
  if (isCompleting) {
    const bom = data.boms.find(b => b.id === po.recipeId);
    if (bom) {
      // 1. Consume raw materials
      bom.materials.forEach(req => {
        const material = data.inventory.find(i => i.id === req.itemId);
        if (material) {
          const qtyToConsume = req.quantityRequired * po.quantity;
          material.quantity = Math.max(0, material.quantity - qtyToConsume);
          // Add outbound transaction
          data.transactions.push({
            id: 'tx_auto_' + Math.random().toString(36).substring(2, 11),
            itemId: material.id,
            type: 'production_use',
            quantity: qtyToConsume,
            date: new Date().toISOString(),
            notes: `Auto: Ishlab chiqarish buyrug'i #${po.id} sarfi`
          });
        }
      });

      // 2. Add finished product to stock
      // Find or create finished product in inventory
      let finishedItem = data.inventory.find(i => i.name.toLowerCase().includes(po.productName.toLowerCase()) && i.type === 'finished');
      if (finishedItem) {
        finishedItem.quantity += po.quantity;
      } else {
        // Create new item
        finishedItem = {
          id: 'inv_' + Math.random().toString(36).substring(2, 11),
          name: `${po.productName} (Tayyor)`,
          type: 'finished',
          quantity: po.quantity,
          unit: 'm²',
          threshold: 50
        };
        data.inventory.push(finishedItem);
      }

      // Add inbound transaction
      data.transactions.push({
        id: 'tx_auto_' + Math.random().toString(36).substring(2, 11),
        itemId: finishedItem.id,
        type: 'inbound',
        quantity: po.quantity,
        date: new Date().toISOString(),
        notes: `Auto: Ishlab chiqarish buyrug'i #${po.id} tayyor mahsulot`
      });
    }
  }

  writeData(data);
  return { productionOrders: data.productionOrders, inventory: data.inventory };
}

// ---- HR & Employees ----
export function getEmployees(): Employee[] {
  return readData().employees;
}

export function upsertEmployee(emp: Employee): Employee[] {
  const data = readData();
  const idx = data.employees.findIndex(e => e.id === emp.id);
  if (idx >= 0) {
    data.employees[idx] = emp;
  } else {
    data.employees.push(emp);
  }
  writeData(data);
  return data.employees;
}

export function deleteEmployee(id: string): Employee[] {
  const data = readData();
  data.employees = data.employees.filter(e => e.id !== id);
  writeData(data);
  return data.employees;
}

// ---- Advances ----
export function getAdvances(): AdvancePayment[] {
  return readData().advances;
}

export function addAdvance(adv: AdvancePayment): AdvancePayment[] {
  const data = readData();
  data.advances.push(adv);
  writeData(data);
  return data.advances;
}

export function deleteAdvance(id: string): AdvancePayment[] {
  const data = readData();
  data.advances = data.advances.filter(a => a.id !== id);
  writeData(data);
  return data.advances;
}

// ---- Work Logs ----
export function getWorkLogs(): WorkLog[] {
  return readData().workLogs;
}

export function addWorkLog(wl: WorkLog): WorkLog[] {
  const data = readData();
  data.workLogs.push(wl);
  writeData(data);
  return data.workLogs;
}

export function deleteWorkLog(id: string): WorkLog[] {
  const data = readData();
  data.workLogs = data.workLogs.filter(w => w.id !== id);
  writeData(data);
  return data.workLogs;
}
