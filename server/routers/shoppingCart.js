const express = require("express");
const router = express.Router();
const { ShoppingCart } = require("../models/shopping-cart");
const { Product } = require("../models/product");
const mongoose = require("mongoose");

// Get list of all items in the shopping cart
router.get(`/:userId`, async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ user: req.params.userId })
      .populate("items.product", "name price"); // Populate product details

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Add an item to the shopping cart
router.post(`/:userId/items`, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found.");
    }

    // Find or create the shopping cart for the user
    let cart = await ShoppingCart.findOne({ user: req.params.userId });
    if (!cart) {
      cart = new ShoppingCart({ user: req.params.userId, items: [] });
    }

    // Check if the item is already in the cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      // Update quantity if the item already exists
      existingItem.quantity += quantity;
    } else {
      // Add a new item to the cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Update item quantity in the shopping cart
router.put(`/:userId/items/:itemId`, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await ShoppingCart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    // Find the item in the cart
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in the cart." });
    }

    // Update the item quantity
    item.quantity = quantity;
    await cart.save();

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Remove an item from the shopping cart
router.delete(`/:userId/items/:itemId`, async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    // Remove the item from the cart
    cart.items.id(req.params.itemId).remove();
    await cart.save();

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Clear the shopping cart
router.delete(`/:userId`, async (req, res) => {
  try {
    await ShoppingCart.findOneAndDelete({ user: req.params.userId });
    res.status(200).json({ success: true, message: "Shopping cart cleared successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
