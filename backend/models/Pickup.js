const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: Date, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
});

module.exports = mongoose.model("Pickup", pickupSchema);
