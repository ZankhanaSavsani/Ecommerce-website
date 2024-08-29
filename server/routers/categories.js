const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  res.status(200).send(category);
});

router.put("/:id", async (req, res) => {
  // Check if the category ID is valid
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Category ID");
  }

  // Check if the category exists
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).send("Category not found with the given ID");
  }

  // Update the category
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );

  if (!updatedCategory) {
    return res.status(404).send("The category cannot be updated!");
  }

  res.send(updatedCategory);
});

router.delete("/:categoryId", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "Category deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Category not found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err });
  }
});

router.post(`/`, async (req, res) => {
  try {
    // Create a new category
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    // Save the category to the database
    category = await category.save();

    // If the category could not be created
    if (!category) {
      return res.status(500).send("The category cannot be created");
    }

    // Respond with the created category and a 201 status code
    res.status(201).send(category);
  } catch (err) {
    // Handle any other errors
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
