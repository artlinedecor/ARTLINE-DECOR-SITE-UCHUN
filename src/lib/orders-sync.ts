import type { Order } from './types';

export async function fetchOrdersClient(): Promise<Order[]> {
  if (typeof window === 'undefined') return [];
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) {
      // API error: fallback to localStorage
      const local = localStorage.getItem('artline_orders');
      return local ? JSON.parse(local) : [];
    }
    const data = await response.json();
    const serverOrders = data.orders || [];

    if (serverOrders.length === 0) {
      // Server returned empty list: check if we have orders in localStorage to restore
      const local = localStorage.getItem('artline_orders');
      if (local) {
        const parsed: Order[] = JSON.parse(local);
        if (parsed && parsed.length > 0) {
          // Restore to server's temporary storage asynchronously
          Promise.all(
            parsed.map(order =>
              fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
              }).catch(() => {})
            )
          ).catch(() => {});
          return parsed;
        }
      }
    }

    // Server data is fresh: update localStorage
    localStorage.setItem('artline_orders', JSON.stringify(serverOrders));
    return serverOrders;
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    const local = localStorage.getItem('artline_orders');
    return local ? JSON.parse(local) : [];
  }
}

export async function saveOrderClient(order: Order): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    // 1. Update localStorage immediately
    const local = localStorage.getItem('artline_orders');
    let orders: Order[] = local ? JSON.parse(local) : [];
    const idx = orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      orders[idx] = order;
    } else {
      orders.push(order);
    }
    localStorage.setItem('artline_orders', JSON.stringify(orders));

    // 2. Post to server
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch (err) {
    console.error('Failed to save order:', err);
  }
}

export async function patchOrderStatusClient(id: string, status: Order['status']): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    // 1. Update localStorage immediately
    const local = localStorage.getItem('artline_orders');
    if (local) {
      const orders: Order[] = JSON.parse(local);
      const idx = orders.findIndex(o => o.id === id);
      if (idx >= 0) {
        orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
        localStorage.setItem('artline_orders', JSON.stringify(orders));
      }
    }

    // 2. Patch server
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  } catch (err) {
    console.error('Failed to patch order:', err);
  }
}

export async function deleteOrderClient(id: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    // 1. Update localStorage immediately
    const local = localStorage.getItem('artline_orders');
    if (local) {
      const orders: Order[] = JSON.parse(local);
      const filtered = orders.filter(o => o.id !== id);
      localStorage.setItem('artline_orders', JSON.stringify(filtered));
    }

    // 2. Delete from server
    await fetch(`/api/orders?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.error('Failed to delete order:', err);
  }
}
