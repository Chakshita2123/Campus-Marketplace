const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

// ✅ Get user wishlist
router.get("/:email", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userEmail: req.params.email });
    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

// ✅ Add product to wishlist
router.post("/add", async (req, res) => {
  try {
    const { userEmail, product } = req.body;
    if (!userEmail || !product) return res.status(400).json({ error: "Missing fields" });

    let wishlist = await Wishlist.findOne({ userEmail });
    if (!wishlist) wishlist = new Wishlist({ userEmail, products: [] });

    // Prevent duplicates
    const exists = wishlist.products.some(p => p.productId.toString() === product.productId);
    if (exists) return res.json({ message: "Already in wishlist" });

    wishlist.products.push(product);
    await wishlist.save();

    res.json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

// ✅ Remove product from wishlist
router.post("/remove", async (req, res) => {
  try {
    const { userEmail, productId } = req.body;
    await Wishlist.updateOne(
      { userEmail },
      { $pull: { products: { productId } } }
    );
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ error: "Error removing product" });
  }
});

module.exports = router;
