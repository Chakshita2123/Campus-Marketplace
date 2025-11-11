const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      category: { type: String },
    },
  ],
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
