const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // make sure models/Product.js exists

// ✅ GET all products (with optional search & category filters)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== "All") filter.category = category;
    if (search) filter.name = new RegExp(search, "i"); // case-insensitive search

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ msg: "Error fetching products" });
  }
});

// ✅ GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ msg: "Error fetching product" });
  }
});

// ✅ ADD new product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, quantity, img, email } = req.body;

    if (!name || !category || !price || quantity === undefined) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      quantity,
      status: quantity > 0 ? "Active" : "Sold Out",
      img: img || "images/default.jpg",
      ownerEmail: email || "demo@chitkara.edu.in",
    });

    await newProduct.save();
    res.status(201).json({
      msg: "✅ Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ msg: "Error adding product" });
  }
});

// ✅ UPDATE product by ID
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updateData = { ...req.body };

    if (quantity !== undefined) {
      updateData.status = quantity <= 0 ? "Sold Out" : "Active";
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({
      msg: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ msg: "Error updating product" });
  }
});

// ✅ DELETE product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({
      msg: "✅ Product deleted successfully",
      deleted: deletedProduct,
    });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ msg: "Error deleting product" });
  }
});

module.exports = router;
