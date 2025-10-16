import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Get sales overview data
export const getSalesOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Today's sales
    const todaySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Yesterday's sales
    const yesterdaySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYesterday,
            $lt: startOfToday,
          },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // This month's sales
    const thisMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfThisMonth },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Last month's sales
    const lastMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfLastMonth,
            $lte: endOfLastMonth,
          },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // All-time sales
    const allTimeSales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const salesData = {
      today: todaySales[0]?.total || 0,
      yesterday: yesterdaySales[0]?.total || 0,
      thisMonth: thisMonthSales[0]?.total || 0,
      lastMonth: lastMonthSales[0]?.total || 0,
      allTime: allTimeSales[0]?.total || 0,
    };

    res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching sales overview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sales overview",
      error: error.message,
    });
  }
};

// Get order status overview
export const getOrderStatusOverview = async (req, res) => {
  try {
    const orderStatusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();

    const statusData = {
      total: totalOrders,
      pending: 0,
      processing: 0,
      delivered: 0,
      shipped: 0,
      cancelled: 0,
    };

    orderStatusCounts.forEach((status) => {
      switch (status._id) {
        case "pending":
          statusData.pending = status.count;
          break;
        case "processing":
          statusData.processing = status.count;
          break;
        case "delivered":
          statusData.delivered = status.count;
          break;
        case "shipped":
          statusData.shipped = status.count;
          break;
        case "cancelled":
          statusData.cancelled = status.count;
          break;
      }
    });

    res.status(200).json({
      success: true,
      data: statusData,
    });
  } catch (error) {
    console.error("Error fetching order status overview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order status overview",
      error: error.message,
    });
  }
};

// Get chart data (weekly sales and orders)
export const getChartData = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get daily sales and orders for the past 7 days
    const dailyData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          sales: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get best selling products
    const bestSellingProducts = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product._id",
          name: { $first: "$product.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Format the data for charts
    const weeklyData = [];
    const colors = ["#34d399", "#2563eb", "#fb923c", "#1e40af", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const dayData = dailyData.find((d) => d._id === dateStr);

      weeklyData.push({
        name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sales: dayData?.sales || 0,
        orders: dayData?.orders || 0,
      });
    }

    const bestSellingFormatted = bestSellingProducts.map((product, index) => ({
      name: product.name,
      value: product.totalSold,
      revenue: product.totalRevenue,
      color: colors[index % colors.length],
    }));

    res.status(200).json({
      success: true,
      data: {
        weeklyData,
        bestSellingProducts: bestSellingFormatted,
      },
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching chart data",
      error: error.message,
    });
  }
};

// Get recent orders
export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentOrders = await Order.find()
      .populate("customer", "first_name last_name email")
      .populate("items.product", "name")
      .populate("items.size", "name")
      .populate("items.color", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    const formattedOrders = recentOrders.map((order) => ({
      id: order._id,
      customer: `${order.customer.first_name} ${order.customer.last_name}`,
      customerEmail: order.customer.email,
      items: order.items.map((item) => ({
        product: item.product.name,
        size: item.size.name,
        color: item.color.name,
        quantity: item.quantity,
        price: item.price,
      })),
      status: order.orderStatus,
      amount: order.totalAmount,
      date: order.createdAt.toISOString().split("T")[0],
      paymentStatus: order.paymentStatus,
    }));

    res.status(200).json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent orders",
      error: error.message,
    });
  }
};

// Get dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const [salesOverview, orderStatus, chartData, recentOrders] = await Promise.all([
      getSalesOverviewData(),
      getOrderStatusData(),
      getChartDataForDashboard(),
      getRecentOrdersData(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesOverview,
        orderStatus,
        chartData,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

// Helper functions
async function getSalesOverviewData() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [todaySales, yesterdaySales, thisMonthSales, lastMonthSales, allTimeSales] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday }, paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfYesterday, $lt: startOfToday }, paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfThisMonth }, paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.aggregate([{ $match: { paymentStatus: "completed" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
  ]);

  return {
    today: todaySales[0]?.total || 0,
    yesterday: yesterdaySales[0]?.total || 0,
    thisMonth: thisMonthSales[0]?.total || 0,
    lastMonth: lastMonthSales[0]?.total || 0,
    allTime: allTimeSales[0]?.total || 0,
  };
}

async function getOrderStatusData() {
  const [orderStatusCounts, totalOrders] = await Promise.all([
    Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
    Order.countDocuments(),
  ]);

  const statusData = {
    total: totalOrders,
    pending: 0,
    processing: 0,
    delivered: 0,
    shipped: 0,
    cancelled: 0,
  };

  orderStatusCounts.forEach((status) => {
    switch (status._id) {
      case "pending":
        statusData.pending = status.count;
        break;
      case "processing":
        statusData.processing = status.count;
        break;
      case "delivered":
        statusData.delivered = status.count;
        break;
      case "shipped":
        statusData.shipped = status.count;
        break;
      case "cancelled":
        statusData.cancelled = status.count;
        break;
    }
  });

  return statusData;
}

async function getChartDataForDashboard() {
  const now = new Date();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [dailyData, bestSellingProducts] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfWeek }, paymentStatus: "completed" } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, sales: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $unwind: "$items" },
      { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product._id",
          name: { $first: "$product.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const weeklyData = [];
  const colors = ["#34d399", "#2563eb", "#fb923c", "#1e40af", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316"];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const dayData = dailyData.find((d) => d._id === dateStr);

    weeklyData.push({
      name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales: dayData?.sales || 0,
      orders: dayData?.orders || 0,
    });
  }

  const bestSellingFormatted = bestSellingProducts.map((product, index) => ({
    name: product.name,
    value: product.totalSold,
    revenue: product.totalRevenue,
    color: colors[index % colors.length],
  }));

  return {
    weeklyData,
    bestSellingProducts: bestSellingFormatted,
  };
}

async function getRecentOrdersData() {
  const recentOrders = await Order.find()
    .populate("customer", "first_name last_name email")
    .populate("items.product", "name")
    .populate("items.size", "name")
    .populate("items.color", "name")
    .sort({ createdAt: -1 })
    .limit(10);

  return recentOrders.map((order) => ({
    id: order._id,
    customer: `${order.customer.first_name} ${order.customer.last_name}`,
    customerEmail: order.customer.email,
    items: order.items.map((item) => ({
      product: item.product.name,
      size: item.size.name,
      color: item.color.name,
      quantity: item.quantity,
      price: item.price,
    })),
    status: order.orderStatus,
    amount: order.totalAmount,
    date: order.createdAt.toISOString().split("T")[0],
    paymentStatus: order.paymentStatus,
  }));
}
