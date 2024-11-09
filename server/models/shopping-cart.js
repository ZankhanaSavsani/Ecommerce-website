const mongoose = require("mongoose");

const shoppingCartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
});

const shoppingCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [shoppingCartItemSchema],
});

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

module.exports = { ShoppingCart };
