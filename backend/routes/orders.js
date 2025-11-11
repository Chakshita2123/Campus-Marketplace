const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product"); // Adjust name if needed

// 🧾 Create a new order
router.post("/create", async (req, res) => {
  try {
    const { items, amount, userId } = req.body;

    const order = new Order({
      user: userId || null,
      items,
      amount,
    });

    await order.save();
    res.status(201).json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Mark order as paid (after fake payment)
router.post("/mark-paid", async (req, res) => {
  try {
    const { orderId, paymentMethod = "fake", txnId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = "paid";
    order.payment = {
      method: paymentMethod,
      txnId,
      verifiedAt: new Date(),
    };

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Error marking order paid:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📦 Get all orders (admin/debug only)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 👤 Get all orders for a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.json({ success: true, orders: [] });
    }

    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
