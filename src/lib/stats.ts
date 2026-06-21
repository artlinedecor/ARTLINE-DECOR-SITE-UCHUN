import type { DashboardStats, Order } from './types';

export function calculateDashboardStats(orders: Order[]): DashboardStats {
  const sold = orders.filter((order) => order.status === 'sold');
  const totalRevenue = sold.reduce((sum, order) => sum + order.totalPrice, 0);

  return {
    totalOrders: orders.length,
    totalRevenue,
    averageCheck: sold.length > 0 ? totalRevenue / sold.length : 0,
    statusCounts: {
      new: orders.filter((order) => order.status === 'new').length,
      measurement: orders.filter((order) => order.status === 'measurement').length,
      design: orders.filter((order) => order.status === 'design').length,
      sold: sold.length,
    },
  };
}
