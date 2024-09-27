const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
const { Category } = require("../models/category");
const multer = require("multer");
require("dotenv").config();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

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

const handleMulterErrors = (err, req, res, next) => {
  if (err) {
    // Handle multer-specific errors and custom errors
    if (err.message.includes("Invalid image type")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image type. Please upload a PNG, JPG, or JPEG image.",
      });
    } else if (err.message === "File or file name not provided.") {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload a valid image.",
      });
    } else {
      // Generic error message
      return res.status(500).json({
        success: false,
        message: "Something went wrong during file upload. Please try again.",
      });
    }
  }
  next(); // Pass to next middleware if no error
};

// GET all products with optional category filter
router.get(`/`, async (req, res) => {
  let filter = {};

  // If categories are provided as a query parameter, filter products by categories
  if (req.query.categories) {
    filter = { category: { $in: req.query.categories.split(",") } };
  }

  try {
    // Fetch the product list based on the filter and populate the category field
    const productList = await Product.find(filter).populate("category");

    // If no products are found, send a 404 response
    if (!productList || productList.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    // Send the list of products in the response
    res.send(productList);
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET products by category ID
router.get('/category/:id', async (req, res) => {
  try {
    // Fetch products for the specified category ID
    const products = await Product.find({ category: req.params.id }).populate("category");

    // If no products are found, send a 404 response
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found in this category" });
    }

    // Send the list of products in the response
    res.send(products);
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: err.message });
  }
});


// GET a single product by ID
router.get(`/:id`, async (req, res) => {
  try {
    // Fetch the product by ID and populate the category field
    const product = await Product.findById(req.params.id).populate("category");

    // If the product is not found, send a 500 response
    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "Product not found" });
    }

    // Send the product data in the response
    res.send(product);
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, message: err.message });
  }
});


// CREATE a new product
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  try {
    // Check if the category ID provided is valid
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).send("Invalid Category");
    }

    // Check if file exists, if not throw an error
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }

    // Extract the file name and construct the image URL
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    // Create a new product with the provided data
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    // Save the product to the database
    product = await product.save();

    // If the product could not be created, send a 500 response
    if (!product) {
      return res.status(500).send("The product cannot be created");
    }

    // Send the created product in the response
    res.send(product);
  } catch (err) {
    // Handle any other errors during the operation
    res.status(500).send({ message: err.message });
  }
});

// UPDATE a product by ID
router.put("/:id", async (req, res) => {
  try {
    // Check if the product ID is valid
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product ID");
    }

    // Check if the category ID provided is valid
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
      { new: true } // Return the updated document
    );

    // If the product could not be updated, send a 404 response
    if (!updatedProduct) {
      return res.status(404).send("The product could not be updated!");
    }

    // Send the updated product in the response
    res.send(updatedProduct);
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).send({ message: err.message });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  try {
    // Attempt to find and delete the product by ID
    const product = await Product.findByIdAndDelete(req.params.id);

    // If the product is found and deleted, send a success response
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted" });
    } else {
      // If the product is not found, send a 404 response
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
  } catch (err) {
    // Handle any errors during the operation
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET the total count of products
router.get(`/get/count`, async (req, res) => {
  try {
    // Count the total number of products in the database
    const productCount = await Product.countDocuments();

    // Send the product count in the response
    res.status(200).send({
      productCount: productCount,
    });
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET a limited number of featured products
router.get(`/get/featured/:count`, async (req, res) => {
  try {
    // Parse the count from the request parameters, defaulting to 0
    const count = req.params.count ? parseInt(req.params.count) : 0;

    // Fetch the specified number of featured products
    const products = await Product.find({ isFeatured: true }).limit(count);

    // Send the list of featured products in the response
    res.status(200).send(products);
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    try {
      // Check if the product ID is valid
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("Invalid Product ID");
      }

      // Check if the product exists
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send("Product not found with the given ID");
      }

      // Extract uploaded files
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).send("No images uploaded");
      }

      // Prepare image URLs
      let imagesPaths = [];
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

      // Create image paths
      files.forEach((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });

      // Update product with image URLs
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imagesPaths,
        },
        { new: true } // Return the updated document
      );

      // If the product could not be updated
      if (!updatedProduct) {
        return res.status(500).send("The product cannot be updated");
      }

      // Send the updated product in the response
      res.send(updatedProduct);
    } catch (err) {
      // Handle any errors during the operation
      res.status(500).send({ message: err.message });
    }
  }
);




module.exports = router;
