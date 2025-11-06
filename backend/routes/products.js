const express = require("express");
const router = express.Router();

// ✅ Temporary in-memory product list
let products = [
  {
    id: 1,
    name: "DSA Book",
    category: "Books",
    price: 300,
    quantity: 5,
    status: "Active",
    img: "images/dsa book.jpeg",
    ownerEmail: "demo@chitkara.edu.in",
  },
  {
    id: 2,
    name: "HP Laptop",
    category: "Electronics",
    price: 22000,
    quantity: 2,
    status: "Active",
    img: "images/laptop.jpeg",
    ownerEmail: "demo@chitkara.edu.in",
  },
  {
    id: 3,
    name: "Bluetooth Earbuds",
    category: "Electronics",
    price: 1499,
    quantity: 0,
    status: "Sold Out",
    img: "images/earbuds.jpeg",
    ownerEmail: "demo@chitkara.edu.in",
  },
];

// ✅ GET all products
router.get("/", (req, res) => {
  res.json(products);
});

// ✅ ADD new product
router.post("/", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    status: req.body.quantity > 0 ? "Active" : "Sold Out",
    img: req.body.img || "images/default.jpg",
    ownerEmail: req.body.email || "demo@chitkara.edu.in", // temporary demo user
  };
  products.push(newProduct);
  res.json({ msg: "Product added successfully", product: newProduct });
});

// ✅ UPDATE product
router.put("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return res.status(404).json({ msg: "Product not found" });

  products[index] = { ...products[index], ...req.body };
  products[index].status = products[index].quantity <= 0 ? "Sold Out" : "Active";

  res.json({ msg: "Product updated successfully", product: products[index] });
});

// ✅ DELETE product
router.delete("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return res.status(404).json({ msg: "Product not found" });

  const deleted = products.splice(index, 1);
  res.json({ msg: "Product deleted successfully", deleted });
});

module.exports = router;
