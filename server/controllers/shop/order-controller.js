require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto"); // For verifying Razorpay signature
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    });

    // Save order in database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus: "created",
      totalAmount,
      orderDate,
      orderUpdateDate,
      razorpayOrderId: razorpayOrder.id,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      razorpayKey: process.env.RAZOR_PAY_KEY_ID, // Send key to frontend
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error while creating Razorpay order",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId, razorpaySignature } = req.body;
    console.log(paymentId);
    console.log(orderId);
    console.log(razorpaySignature);
    if (!razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay signature",
      });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    console.log(generatedSignature, "generatedSignature");
    console.log(razorpaySignature, "RazorPaySignature");
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    let order = await Order.findOne({ razorpayOrderId: orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status and deduct stock
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product || product.totalStock < item.quantity) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for product ${
            product ? product.title : item.productId
          }`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error while capturing Razorpay payment",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
