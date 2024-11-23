const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const mongoose = require("mongoose");
const multer = require('multer');


// Define the file type map for image uploads
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// Set up multer for image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    if (!file || !file.originalname) {
      return cb(new Error("File or file name not provided"));
    }
    const fileName = file.originalname
      .split(" ")
      .join("-")
      .split(".")
      .slice(0, -1)
      .join(".");
    const extension = FILE_TYPE_MAP[file.mimetype];
    if (!extension) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

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
router.put("/:id", uploadOptions.single("icon"), async (req, res) => {
  try {
    // Validate the category ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Category ID");
    }

    // Find the category by ID
    const category = await Category.findById(req.params.id);

    // Check if the category exists
    if (!category) {
      return res.status(404).send("Category not found");
    }

    // Check if the new icon is uploaded
    if (req.file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      category.icon = `${basePath}${fileName}`; // Update the icon URL
    }

    // Update the category fields (name, color)
    category.name = req.body.name || category.name; // Only update if provided
    category.color = req.body.color || category.color; // Only update if provided

    // Save the updated category
    const updatedCategory = await category.save();

    // Send the updated category in the response
    res.status(200).json(updatedCategory);
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

// Create a new category with image upload
router.post(`/`, uploadOptions.single("icon"), async (req, res) => {
  try {
    // Check if the icon file exists
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }

    // Extract the file name and construct the image URL
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    // Create a new category with the provided data and image URL
    let category = new Category({
      name: req.body.name,
      icon: `${basePath}${fileName}`, // Save the image URL
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
