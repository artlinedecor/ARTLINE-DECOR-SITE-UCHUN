import { NextResponse } from 'next/server';
import { 
  getEmployees, 
  upsertEmployee, 
  deleteEmployee,
  getAdvances,
  addAdvance,
  deleteAdvance,
  getWorkLogs,
  addWorkLog,
  deleteWorkLog,
  getOrders
} from '@/lib/server-data';
import { isAdminRequest } from '@/lib/server-auth';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ 
    success: true, 
    employees: getEmployees(),
    advances: getAdvances(),
    workLogs: getWorkLogs(),
    orders: getOrders().filter(o => o.status === 'sold') // Only sold orders for KPI calc
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

  const { action, employee, advance, workLog } = payload;

  if (action === 'save_employee') {
    const list = upsertEmployee(employee);
    return NextResponse.json({ success: true, employees: list });
  }

  if (action === 'add_advance') {
    const list = addAdvance(advance);
    return NextResponse.json({ success: true, advances: list });
  }

  if (action === 'add_worklog') {
    const list = addWorkLog(workLog);
    return NextResponse.json({ success: true, workLogs: list });
  }

  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  }

  if (action === 'delete_employee') {
    const list = deleteEmployee(id);
    return NextResponse.json({ success: true, employees: list });
  }

  if (action === 'delete_advance') {
    const list = deleteAdvance(id);
    return NextResponse.json({ success: true, advances: list });
  }

  if (action === 'delete_worklog') {
    const list = deleteWorkLog(id);
    return NextResponse.json({ success: true, workLogs: list });
  }

  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}
