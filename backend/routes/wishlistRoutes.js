const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

// ✅ Add Product to Wishlist
router.post("/add", async (req, res) => {
  try {
    const { userEmail, product } = req.body;
    if (!userEmail || !product) {
      return res.status(400).json({ error: "Missing userEmail or product data" });
    }

    let wishlist = await Wishlist.findOne({ userEmail });

    // 🆕 Create wishlist if user doesn't have one
    if (!wishlist) {
      wishlist = new Wishlist({ userEmail, products: [] });
    }

    // Prevent duplicates
    const exists = wishlist.products.some(
      (p) => p.productId === product.productId || p.name === product.name
    );
    if (exists) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    wishlist.products.push({
      productId: product.productId || product.name,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });

    await wishlist.save();
    return res.status(200).json({ message: "Added to wishlist ✅" });
  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
    res.status(500).json({ error: "Server error while adding to wishlist" });
  }
});

// ✅ Remove Product from Wishlist
router.post("/remove", async (req, res) => {
  try {
    const { userEmail, productId } = req.body;
    if (!userEmail || !productId) {
      return res.status(400).json({ error: "Missing userEmail or productId" });
    }

    const wishlist = await Wishlist.findOne({ userEmail });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.productId !== productId && p.name !== productId
    );

    await wishlist.save();
    res.status(200).json({ message: "Removed from wishlist ❌" });
  } catch (err) {
    console.error("❌ Error removing from wishlist:", err);
    res.status(500).json({ error: "Server error while removing from wishlist" });
  }
});

// ✅ Get Wishlist for a User
router.get("/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    if (!userEmail) {
      return res.status(400).json({ error: "Missing userEmail" });
    }

    const wishlist = await Wishlist.findOne({ userEmail });
    if (!wishlist) {
      return res.status(200).json({ products: [] }); // empty wishlist
    }

    res.status(200).json({ products: wishlist.products });
  } catch (err) {
    console.error("❌ Error fetching wishlist:", err);
    res.status(500).json({ error: "Server error while fetching wishlist" });
  }
});

module.exports = router;
