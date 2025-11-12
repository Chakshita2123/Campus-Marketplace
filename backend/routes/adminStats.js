const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");

// 🧮 Get total users
router.get("/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error counting users:", err);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

// 🛒 Get total active listings
router.get("/products/count", async (req, res) => {
  try {
    const count = await Product.countDocuments({ approved: true }); // or just Product.countDocuments()
    res.json({ count });
  } catch (err) {
    console.error("Error counting listings:", err);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
});

// ⚠️ Get pending reports — dummy fallback (since Report model not created)
router.get("/reports/count", async (req, res) => {
  try {
    res.json({ pending: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;
