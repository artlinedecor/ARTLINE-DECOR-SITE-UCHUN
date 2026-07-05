import { NextResponse } from 'next/server';
import { 
  getInventory, 
  upsertInventoryItem, 
  deleteInventoryItem, 
  getTransactions, 
  addTransaction 
} from '@/lib/server-data';
import { isAdminRequest } from '@/lib/server-auth';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    success: true, 
    inventory: getInventory(),
    transactions: getTransactions()
  });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const { action, item, transaction } = payload;

  if (action === 'save_item') {
    const items = upsertInventoryItem(item);
    return NextResponse.json({ success: true, inventory: items });
  }

  if (action === 'add_transaction') {
    const txs = addTransaction(transaction);
    return NextResponse.json({ 
      success: true, 
      transactions: txs,
      inventory: getInventory() // Return updated inventory
    });
  }

  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  }

  const items = deleteInventoryItem(id);
  return NextResponse.json({ success: true, inventory: items });
}
