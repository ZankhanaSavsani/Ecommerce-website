const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const mongoose = require("mongoose");

// GET all categories
router.get(`/`, async (req, res) => {
  try {
    // Fetch all categories from the database
    const categoryList = await Category.find();

    // Check if categories were found
    if (!categoryList) {
      return res.status(500).json({ success: false, message: "No categories found." });
    }

    // Send the list of categories in the response
    res.status(200).send(categoryList);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a single category by ID
router.get("/:id", async (req, res) => {
  try {
    // Find a category by its ID
    const category = await Category.findById(req.params.id);

    // Check if the category was found
    if (!category) {
      return res.status(404).json({ message: "The category with the given ID was not found." });
    }

    // Send the category in the response
    res.status(200).send(category);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE a category by ID
router.put("/:id", async (req, res) => {
  try {
    // Validate the category ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Category ID");
    }

    // Update the category with the provided data
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true } // Return the updated document
    );

    // Check if the category update was successful
    if (!updatedCategory) {
      return res.status(404).send("The category cannot be updated!");
    }

    // Send the updated category in the response
    res.send(updatedCategory);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a category by ID
router.delete("/:categoryId", async (req, res) => {
  try {
    // Attempt to delete the category by its ID
    const category = await Category.findByIdAndDelete(req.params.categoryId);

    // Check if the category was successfully deleted
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "Category deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Category not found!" });
    }
  } catch (error) {
    // Handle any errors during the operation
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE a new category
router.post(`/`, async (req, res) => {
  try {
    // Create a new category with the provided data
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    // Save the category to the database
    category = await category.save();

    // Check if the category was successfully created
    if (!category) {
      return res.status(500).send("The category cannot be created");
    }

    // Send the created category in the response
    res.status(201).send(category);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
