import type { Order } from './types';

function getCredentials() {
  const url = process.env.ERPNEXT_API_URL || '';
  const apiKey = process.env.ERPNEXT_API_KEY || '';
  const apiSecret = process.env.ERPNEXT_API_SECRET || '';
  return { url, apiKey, apiSecret };
}

function getHeaders(apiKey: string, apiSecret: string) {
  return {
    'Authorization': `token ${apiKey}:${apiSecret}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

/**
 * Format local order items into a readable string for ERPNext description.
 */
function formatOrderDescription(order: Order): string {
  const itemsText = order.items
    .map(
      (item) =>
        `- ${item.elementType} (${item.name}): ${item.length}m x ${item.width}m x ${item.height}m | Qty: ${item.quantity} | Unit: $${item.unitPrice} | Total: $${item.totalPrice}`
    )
    .join('\n');

  return `
[Artline Decor Website Order]
Order ID: ${order.id}
Client Address: ${order.address}
Total Price: $${order.totalPrice}
Created At: ${order.createdAt}
Updated At: ${order.updatedAt}
Notes: ${order.notes || 'None'}

Order Items:
${itemsText || 'No items configured.'}
`.trim();
}

/**
 * Maps local Order status to ERPNext standard Lead status
 */
function mapStatusToERPNext(status: Order['status']): string {
  switch (status) {
    case 'new':
      return 'Lead';
    case 'measurement':
      return 'Open';
    case 'design':
      return 'Replied';
    case 'sold':
      return 'Converted';
    default:
      return 'Lead';
  }
}

/**
 * Search for an existing Lead in ERPNext by the local Order ID.
 * The order ID is stored in the lead_name as "[ORD-xxxx]" or inside the description.
 */
async function findLeadByOrderId(url: string, headers: HeadersInit, orderId: string): Promise<string | null> {
  try {
    const queryUrl = `${url}/api/resource/Lead?filters=[["description","like","%Order ID: ${orderId}%"]]&fields=["name"]`;
    const res = await fetch(queryUrl, { headers });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      return json.data[0].name;
    }
  } catch (err) {
    console.error(`ERPNext: Failed to search lead for order ${orderId}:`, err);
  }
  return null;
}

/**
 * Create or update a Lead in ERPNext
 */
export async function syncOrderToERPNext(order: Order): Promise<void> {
  const { url, apiKey, apiSecret } = getCredentials();
  if (!url || !apiKey || !apiSecret) {
    console.warn('ERPNext: Integration credentials not configured in environment variables.');
    return;
  }

  const headers = getHeaders(apiKey, apiSecret);
  const description = formatOrderDescription(order);
  const payload = {
    lead_name: `[ORD-${order.id.substring(0, 6)}] ${order.clientName}`,
    mobile_no: order.phone,
    status: mapStatusToERPNext(order.status),
    description: description,
    company: 'Artline Decor',
    source: 'Website',
  };

  try {
    const existingLeadName = await findLeadByOrderId(url, headers, order.id);
    if (existingLeadName) {
      // Update existing Lead
      console.log(`ERPNext: Updating existing Lead ${existingLeadName} for order ${order.id}`);
      const updateUrl = `${url}/api/resource/Lead/${existingLeadName}`;
      const res = await fetch(updateUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to update Lead: ${res.status} ${errText}`);
      }
    } else {
      // Create new Lead
      console.log(`ERPNext: Creating new Lead for order ${order.id}`);
      const createUrl = `${url}/api/resource/Lead`;
      const res = await fetch(createUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to create Lead: ${res.status} ${errText}`);
      }
    }
  } catch (err) {
    console.error(`ERPNext: Error syncing order ${order.id}:`, err);
  }
}

/**
 * Sync status updates specifically
 */
export async function syncOrderStatusToERPNext(id: string, status: Order['status']): Promise<void> {
  const { url, apiKey, apiSecret } = getCredentials();
  if (!url || !apiKey || !apiSecret) return;

  const headers = getHeaders(apiKey, apiSecret);
  try {
    const leadName = await findLeadByOrderId(url, headers, id);
    if (!leadName) {
      console.warn(`ERPNext: Could not find lead to update status for order ${id}`);
      return;
    }

    console.log(`ERPNext: Updating Lead ${leadName} status to ${status}`);
    const updateUrl = `${url}/api/resource/Lead/${leadName}`;
    const res = await fetch(updateUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        status: mapStatusToERPNext(status),
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to update status: ${res.status} ${errText}`);
    }
  } catch (err) {
    console.error(`ERPNext: Error updating status for order ${id}:`, err);
  }
}

/**
 * Delete lead in ERPNext
 */
export async function syncDeleteOrderToERPNext(id: string): Promise<void> {
  const { url, apiKey, apiSecret } = getCredentials();
  if (!url || !apiKey || !apiSecret) return;

  const headers = getHeaders(apiKey, apiSecret);
  try {
    const leadName = await findLeadByOrderId(url, headers, id);
    if (!leadName) return;

    console.log(`ERPNext: Deleting Lead ${leadName} for order ${id}`);
    const deleteUrl = `${url}/api/resource/Lead/${leadName}`;
    const res = await fetch(deleteUrl, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to delete Lead: ${res.status} ${errText}`);
    }
  } catch (err) {
    console.error(`ERPNext: Error deleting Lead for order ${id}:`, err);
  }
}
