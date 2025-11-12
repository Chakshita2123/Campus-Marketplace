const express = require("express");
const router = express.Router();
const Pickup = require("../models/Pickup");

// ✅ Create a pickup (User side)
router.post("/create", async (req, res) => {
  try {
    const { userId, productId, name, location, time } = req.body;

    if (!userId || !productId || !name || !location || !time) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const pickup = new Pickup({
      userId,
      productId,
      name,
      location,
      time,
      status: "pending",
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

// ✅ Get all pickups for a specific user (Buyer)
router.get("/:userId", async (req, res) => {
  try {
    const pickups = await Pickup.find({ userId: req.params.userId })
      .populate("productId", "name img price")
      .sort({ time: 1 });
    res.json({ success: true, pickups });
  } catch (err) {
    console.error("❌ Error fetching user pickups:", err);
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
    if (!pickup)
      return res
        .status(404)
        .json({ success: false, message: "Pickup not found" });
    res.json({ success: true, pickup });
  } catch (err) {
    console.error("❌ Error marking complete:", err);
    res.status(500).json({ success: false, message: "Failed to mark complete" });
  }
});

// ✅ Delete / cancel pickup
router.delete("/delete/:id", async (req, res) => {
  try {
    const pickup = await Pickup.findByIdAndUpdate(req.params.id, {
      status: "cancelled",
    });
    if (!pickup)
      return res
        .status(404)
        .json({ success: false, message: "Pickup not found" });

    res.json({ success: true, message: "Pickup cancelled" });
  } catch (err) {
    console.error("❌ Error cancelling pickup:", err);
    res.status(500).json({ success: false, message: "Error cancelling pickup" });
  }
});

// ✅ Get pickups for seller (based on sellerId from product)
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .populate({
        path: "productId",
        match: { ownerId: req.params.sellerId },
        select: "name img price ownerId",
      })
      .populate("userId", "name email")
      .sort({ time: 1 });

    const filtered = pickups.filter((p) => p.productId);
    res.json({ success: true, pickups: filtered });
  } catch (err) {
    console.error("❌ Error fetching seller pickups:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching seller pickups" });
  }
});

// ✅ Update pickup status (PUT)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!pickup)
      return res
        .status(404)
        .json({ success: false, message: "Pickup not found" });

    res.json({ success: true, pickup });
  } catch (err) {
    console.error("❌ Error updating pickup status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🆕 ✅ Get all pickups (Admin dashboard)
router.get("/", async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .populate("userId", "name email")
      .populate("productId", "name price img")
      .sort({ createdAt: -1 });

    res.json({ success: true, pickups });
  } catch (err) {
    console.error("❌ Error fetching all pickups:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
