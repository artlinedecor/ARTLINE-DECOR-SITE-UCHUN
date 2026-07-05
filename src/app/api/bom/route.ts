import { NextResponse } from 'next/server';
import { 
  getBOMs, 
  upsertBOM, 
  deleteBOM, 
  getProductionOrders, 
  upsertProductionOrder 
} from '@/lib/server-data';
import { isAdminRequest } from '@/lib/server-auth';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ 
    success: true, 
    boms: getBOMs(),
    productionOrders: getProductionOrders()
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

  const { action, bom, productionOrder } = payload;

  if (action === 'save_bom') {
    const boms = upsertBOM(bom);
    return NextResponse.json({ success: true, boms });
  }

  if (action === 'save_production') {
    const result = upsertProductionOrder(productionOrder);
    return NextResponse.json({ 
      success: true, 
      productionOrders: result.productionOrders,
      inventory: result.inventory 
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

  const boms = deleteBOM(id);
  return NextResponse.json({ success: true, boms });
}
