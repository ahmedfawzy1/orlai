import Order from "../models/order.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Size from "../models/size.model.js";
import Color from "../models/color.model.js";

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
    const orders = await Order.find({ customer: req.user._id })
      .populate("items.product")
      .populate("items.size")
      .populate("items.color")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
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
    });

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

    order.orderStatus = "cancelled";
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

    const order = await Order.findById(id);
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

    order.orderStatus = status;
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
