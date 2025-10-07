import Order from "../models/order.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Size from "../models/size.model.js";
import Color from "../models/color.model.js";
import Review from "../models/review.model.js";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentDetails, totalAmount, shippingCost } = req.body;

    // Convert size and color names to ObjectIds if needed
    const itemsWithIds = await Promise.all(
      items.map(async (item) => {
        let sizeId = item.size;
        let colorId = item.color;

        // If size is not a valid ObjectId, look up by name
        if (typeof sizeId === "string" && sizeId.length !== 24) {
          const sizeDoc = await Size.findOne({ name: sizeId });
          if (!sizeDoc) throw new Error(`Size not found: ${sizeId}`);
          sizeId = sizeDoc._id;
        }

        // If color is not a valid ObjectId, look up by name
        if (typeof colorId === "string" && colorId.length !== 24) {
          const colorDoc = await Color.findOne({ name: colorId });
          if (!colorDoc) throw new Error(`Color not found: ${colorId}`);
          colorId = colorDoc._id;
        }

        return { ...item, size: sizeId, color: colorId };
      })
    );

    // Create Stripe payment intent if payment method is card
    let paymentIntent = null;
    if (paymentMethod === "card") {
      try {
        if (!paymentDetails || !paymentDetails.stripePaymentMethodId) {
          console.error("Missing payment method ID:", paymentDetails);
          return res.status(400).json({
            success: false,
            error: "Payment method ID is required for card payments",
          });
        }
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: "usd",
          payment_method: paymentDetails.stripePaymentMethodId,
          confirm: true,
          return_url: `${process.env.BACKEND_API_URL}/checkout/success`,
        });
      } catch (error) {
        console.error("Stripe payment error:", {
          message: error.message,
          type: error.type,
          code: error.code,
          decline_code: error.decline_code,
          raw: error,
        });
        return res.status(400).json({
          success: false,
          error: error.message || "Payment processing failed",
        });
      }
    }

    const order = await Order.create({
      customer: req.user._id,
      items: itemsWithIds,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "card" ? "completed" : "pending",
      paymentDetails:
        paymentMethod === "card"
          ? {
              stripePaymentId: paymentIntent.id,
              cardType: paymentDetails.cardType,
              last4: paymentDetails.last4,
            }
          : null,
      totalAmount,
      shippingCost,
    });

    // Reserve inventory immediately when order is created
    await reserveInventoryForOrder(order);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error creating order",
    });
  }
};

// Get all orders for a customer
export const getCustomerOrders = async (req, res) => {
  try {
    const ordersFromDB = await Order.find({ customer: req.user._id })
      .populate("items.product")
      .populate("items.size")
      .populate("items.color")
      .sort({ createdAt: -1 })
      .lean();

    const orders = await Promise.all(
      ordersFromDB.map(async (order) => {
        const itemsWithReviewStatus = await Promise.all(
          order.items.map(async (item) => {
            // Check if product exists and has _id before trying to access it
            if (!item.product || !item.product._id) {
              console.warn(`Order ${order._id} has item with missing product data:`, item);
              return { ...item, hasReviewed: false };
            }

            const review = await Review.findOne({
              product: item.product._id,
              email: req.user.email,
            });
            return { ...item, hasReviewed: !!review };
          })
        );
        return { ...order, items: itemsWithReviewStatus };
      })
    );

    // Filter out orders that have no valid items
    const validOrders = orders.filter(
      (order) => order.items && order.items.length > 0 && order.items.some((item) => item.product && item.product._id)
    );

    res.status(200).json({
      success: true,
      data: validOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching orders",
    });
  }
};

// Get single order details
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    })
      .populate("items.product")
      .populate("items.size")
      .populate("items.color");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching order details",
    });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Only allow cancellation if order is pending
    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Cannot cancel order in current status",
      });
    }

    // If payment was made via card, process refund
    if (order.paymentMethod === "card" && order.paymentStatus === "completed") {
      await stripe.refunds.create({
        payment_intent: order.paymentDetails.stripePaymentId,
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = "cancelled";

    // Handle inventory restoration if needed
    await handleInventoryUpdate(order, previousStatus, "cancelled");

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      error: "Error cancelling order",
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentMethod, startDate, endDate, search, limit = 20, page = 1 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    // Search by customer name (first_name or last_name)
    if (search) {
      query.$or = [{ "shippingAddress.name": { $regex: search, $options: "i" } }];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(query)
      .populate("customer", "first_name last_name email")
      .populate("items.product")
      .populate("items.size")
      .populate("items.color")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Order.countDocuments(query);
    res.status(200).json({
      success: true,
      data: orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Admin get all orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching orders",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id).populate("items.product");
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    // Handle inventory updates based on status changes
    await handleInventoryUpdate(order, previousStatus, status);

    // If order is COD and status is delivered, mark payment as completed
    if (order.paymentMethod === "cod" && status === "delivered") {
      order.paymentStatus = "completed";
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error updating order status",
    });
  }
};

// Helper function to handle inventory updates based on order status changes
const handleInventoryUpdate = async (order, previousStatus, newStatus) => {
  const Product = (await import("../models/product.model.js")).default;

  // Define status transitions that affect inventory
  const inventoryReducingStatuses = ["processing", "shipped", "delivered"];
  const inventoryRestoringStatuses = ["cancelled"];

  // Check if we need to reduce inventory (order is being processed/shipped/delivered)
  if (inventoryReducingStatuses.includes(newStatus) && !inventoryReducingStatuses.includes(previousStatus) && previousStatus !== "cancelled") {
    // Reduce inventory for each item in the order
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (!product) continue;

      // Find the specific variant (color + size combination)
      const variant = product.variants.find((v) => v.color.toString() === item.color.toString() && v.size.toString() === item.size.toString());

      if (variant) {
        // Ensure we don't go below 0
        variant.stock = Math.max(0, variant.stock - item.quantity);
        await product.save();
      }
    }
  }

  // Check if we need to restore inventory (order is being cancelled)
  if (inventoryRestoringStatuses.includes(newStatus) && inventoryReducingStatuses.includes(previousStatus)) {
    // Restore inventory for each item in the order
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (!product) continue;

      // Find the specific variant (color + size combination)
      const variant = product.variants.find((v) => v.color.toString() === item.color.toString() && v.size.toString() === item.size.toString());

      if (variant) {
        variant.stock += item.quantity;
        await product.save();
      }
    }
  }
};

// Helper function to reserve inventory when order is created
const reserveInventoryForOrder = async (order) => {
  const Product = (await import("../models/product.model.js")).default;

  // Reserve inventory for each item in the order
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    // Find the specific variant (color + size combination)
    const variant = product.variants.find((v) => v.color.toString() === item.color.toString() && v.size.toString() === item.size.toString());

    if (variant) {
      // Check if we have enough stock
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${variant.stock}, Requested: ${item.quantity}`);
      }

      // Reserve the inventory
      variant.stock -= item.quantity;
      await product.save();
    }
  }
};
