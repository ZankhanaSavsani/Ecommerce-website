const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { Category } = require("../models/category");
require("dotenv").config();

router.get(`/`, async (req, res) => {
  let filter = {};
  
  if (req.query.categories) {
    filter = { category: { $in: req.query.categories.split(",") } };
  }

  try {
    const productList = await Product.find(filter).populate("category");

    if (!productList || productList.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    res.send(productList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get(`/:id`, async (req, res) => {
  let product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) {
    return res.status(500).send("the product can not be created");
  }
  res.send(product);
});

router.put("/:id", async (req, res) => {
  // Check if the product ID is valid
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product ID");
  }

  // Check if the category ID is valid
  if (!mongoose.isValidObjectId(req.body.category)) {
    return res.status(400).send("Invalid Category ID");
  }

  // Check if the product exists
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("Product not found with the given ID");
  }

  // Check if the category exists
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  // Proceed with updating the product
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(404).send("The product could not be updated!");
  }

  res.send(updatedProduct);
});


router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err });
  }
});

router.get(`/get/count`, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    res.status(200).send({
      productCount: productCount
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get(`/get/featured/:count`, async (req, res) => {
  try {
    const count = req.params.count ? parseInt(req.params.count) : 0;
    const products = await Product.find({isFeatured: true}).limit(count);

    res.status(200).send(products);
  } catch (err) {
    // Handle errors
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
