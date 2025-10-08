import axios from './axios';

export interface SalesOverview {
  today: number;
  yesterday: number;
  thisMonth: number;
  lastMonth: number;
  allTime: number;
}

export interface OrderStatus {
  total: number;
  pending: number;
  processing: number;
  delivered: number;
  shipped: number;
  cancelled: number;
}

export interface ChartDataPoint {
  name: string;
  sales: number;
  orders: number;
}

export interface BestSellingProduct {
  name: string;
  value: number;
  revenue: number;
  color: string;
}

export interface ChartData {
  weeklyData: ChartDataPoint[];
  bestSellingProducts: BestSellingProduct[];
}

export interface OrderItem {
  product: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  customerEmail: string;
  items: OrderItem[];
  status: string;
  amount: number;
  date: string;
  paymentStatus: string;
}

export interface DashboardSummary {
  salesOverview: SalesOverview;
  orderStatus: OrderStatus;
  chartData: ChartData;
  recentOrders: RecentOrder[];
}

// Get sales overview data
export const getSalesOverview = async (): Promise<SalesOverview> => {
  try {
    const response = await axios.get('/dashboard/sales-overview');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sales overview:', error);
    throw error;
  }
};

// Get order status overview
export const getOrderStatusOverview = async (): Promise<OrderStatus> => {
  try {
    const response = await axios.get('/dashboard/order-status');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order status overview:', error);
    throw error;
  }
};

// Get chart data
export const getChartData = async (): Promise<ChartData> => {
  try {
    const response = await axios.get('/dashboard/chart-data');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

// Get recent orders
export const getRecentOrders = async (
  limit: number = 10,
): Promise<RecentOrder[]> => {
  try {
    const response = await axios.get(`/dashboard/recent-orders?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

// Get complete dashboard summary
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await axios.get('/dashboard/summary');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
