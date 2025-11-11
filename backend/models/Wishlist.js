const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      image: String,
      category: String,
    },
  ],
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
