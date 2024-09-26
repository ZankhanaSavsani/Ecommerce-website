const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const { populate } = require("dotenv");
const { Product } = require("../models/product");
const mongoose = require("mongoose");

// Get list of all orders
router.get(`/`, async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate("user", "name") // Populate user details
      .sort({ dateOrdered: -1 }); // Sort by most recent order

    if (!orderList) {
      return res.status(500).json({ success: false });
    }

    res.send(orderList);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get specific order by ID
router.get(`/:id`, async (req, res) => {
  try {
    // Validate the order ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Order ID");
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Product",
          populate: "category",
        },
      });

    if (!order) {
      return res
        .status(500)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// CREATE a new order
router.post(`/`, async (req, res) => {
  try {
    // Map through the orderItems and save each one
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        const savedOrderItem = await newOrderItem.save();
        return savedOrderItem._id;
      })
    );

    const orderItemsIdsResolved = await orderItemsIds;

    // Calculate total price of all items in the order
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const finalTotalPrice = totalPrices.reduce((acc, curr) => acc + curr, 0); // Sum up total prices

    // Create a new order with the provided data
    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: finalTotalPrice,
      user: req.body.user,
    });

    // Save the order to the database
    order = await order.save();

    // Check if the order was successfully created
    if (!order) {
      return res.status(500).send("The order cannot be created");
    }

    // Send the created order in the response
    res.status(201).send(order);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).send({ message: error.message });
  }
});

// UPDATE an order status by ID
router.put("/:id", async (req, res) => {
  try {
    // Validate the order ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Order ID");
    }

    // Update the order's status with the provided value
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true } // Return the updated document
    );

    // Check if the order update was successful
    if (!updatedOrder) {
      return res.status(404).send("The order cannot be updated!");
    }

    // Send the updated order in the response
    res.send(updatedOrder);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE an order by ID
router.delete("/:id", async (req, res) => {
  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Order ID" });
    }

    // Find the order by ID to get the orderItems IDs
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    }

    // Delete all the associated orderItems
    await Promise.all(
      order.orderItems.map(async (orderItemId) => {
        await OrderItem.findByIdAndDelete(orderItemId);
      })
    );

    // After deleting the orderItems, delete the order itself
    await Order.findByIdAndDelete(req.params.id);

    // Return success message
    res
      .status(200)
      .json({
        success: true,
        message: "Order and associated Order Items deleted successfully",
      });
  } catch (error) {
    // Handle any errors during the operation
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/get/totalsales", async (req, res) => {
  try {
    // Aggregate the total sales by summing the totalPrice field
    const totalsales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalsales || totalsales.length === 0) {
      return res.status(400).send("The order sales cannot be generated");
    }

    // Extract the totalsales value from the result array and send it
    res.send({ totalsales: totalsales[0].totalsales });
  } catch (error) {
    // Handle any potential errors
    res.status(500).send({ success: false, error: error.message });
  }
});

// GET the total count of orders
router.get(`/get/count`, async (req, res) => {
  try {
    // Count the total number of orders in the database
    const orderCount = await Order.countDocuments();

    // Send the order count in the response
    res.status(200).send({
      orderCount: orderCount,
    });
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get list of all orders of a user
router.get(`/get/userorders/:userid`, async (req, res) => {
  try {
    const userorderList = await Order.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Product",
          populate: "category",
        },
      })
      .sort({ dateOrdered: -1 }); // Sort by most recent order

    if (!userorderList || userorderList.length === 0) {
      // Check if no orders found
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user." });
    }

    res.status(200).send(userorderList);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
