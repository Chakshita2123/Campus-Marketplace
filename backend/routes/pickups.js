const express = require("express");
const router = express.Router();
const Pickup = require("../models/Pickup");

// ✅ Create a pickup
router.post("/create", async (req, res) => {
  try {
    const { userId, productId, name, location, time } = req.body;

    if (!userId || !productId || !name || !location || !time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create pickup with default status = "pending"
    const pickup = new Pickup({
      userId,
      productId,
      name,
      location,
      time,
      status: "pending", // 🆕 added
    });
    await pickup.save();

    res.status(201).json({
      success: true,
      message: "Pickup scheduled successfully",
      pickup,
    });
  } catch (err) {
    console.error("❌ Error creating pickup:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get all pickups for a user (buyer)
router.get("/:userId", async (req, res) => {
  try {
    const pickups = await Pickup.find({ userId: req.params.userId })
      .populate("productId", "name img price")
      .sort({ time: 1 });
    res.json({ success: true, pickups });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching pickups" });
  }
});

// ✅ Mark pickup as completed
router.post("/complete/:id", async (req, res) => {
  try {
    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    res.json({ success: true, pickup });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark complete" });
  }
});

// ✅ Delete / cancel pickup
router.delete("/delete/:id", async (req, res) => {
  try {
    await Pickup.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.json({ success: true, message: "Pickup cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error cancelling pickup" });
  }
});

// 🆕 Get pickups for seller (based on sellerId from product)
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .populate({
        path: "productId",
        match: { ownerId: req.params.sellerId }, // only seller’s products
        select: "name img price ownerId",
      })
      .populate("userId", "name email")
      .sort({ time: 1 });

    // filter null products (those not belonging to seller)
    const filtered = pickups.filter((p) => p.productId);
    res.json({ success: true, pickups: filtered });
  } catch (err) {
    console.error("❌ Error fetching seller pickups:", err);
    res.status(500).json({ success: false, message: "Error fetching seller pickups" });
  }
});

// 🆕 Update pickup status (PUT)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!pickup)
      return res.status(404).json({ success: false, message: "Pickup not found" });

    res.json({ success: true, pickup });
  } catch (err) {
    console.error("❌ Error updating pickup status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
