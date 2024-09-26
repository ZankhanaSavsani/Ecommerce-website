const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken");

// GET all users
router.get(`/`, async (req, res) => {
  try {
    // Fetch all users, excluding their password hashes
    const userList = await User.find().select("-passwordHash");

    // Check if users were found
    if (!userList) {
      return res
        .status(500)
        .json({ success: false, message: "No users found." });
    }

    // Send the list of users in the response
    res.status(200).send(userList);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET a single user by ID
router.get("/:id", async (req, res) => {
  try {
    // Find a user by their ID, excluding the password hash
    const user = await User.findById(req.params.id).select("-passwordHash");

    // Check if the user was found
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "The user with the given ID was not found.",
        });
    }

    // Send the user data in the response
    res.status(200).send(user);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE a new user
router.post(`/`, async (req, res) => {
  try {
    // Validation: Check if required fields are provided
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields." });
    }

    // Check if the user with the provided email already exists
    const isUser = await User.findOne({ email: req.body.email });

    if (isUser) {
      return res.status(400).json({
        error: true,
        message: "User Already Exists...!",
      });
    }

    // Hash the password asynchronously
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // Create a new user object
    let users = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash, // Store the hashed password
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    // Save the user to the database
    users = await users.save();

    if (!users) {
      return res.status(500).send("The user cannot be created");
    }

    // Exclude sensitive fields from the response
    const { passwordHash: _, ...userWithoutPassword } = users.toObject();

    // Respond with the created user and a 201 status code
    res.status(201).send(userWithoutPassword);
  } catch (err) {
    // Log and handle errors
    console.error("Error creating user:", err);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: err.message });
  }
});

// router.post('/login', async (req, res) => {
//   try {
//       const user = await User.findOne({ email: req.body.email }).select('email passwordHash');
//       const secret = process.env.SECRET_KEY;

//       if (!user) {
//           return res.status(404).json({ success: false, message: "User not found" });
//       }

//       const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
//       if (isPasswordValid) {
//           const token = jwt.sign(
//               {
//                   userId: user.id
//               },
//               secret,
//               { expiresIn: '1d' }  // Token expires in 1 day
//           );
//           return res.status(200).send({ user: user.email, token: token });
//       } else {
//           return res.status(401).json({ success: false, message: "Invalid password" });
//       }
//   } catch (error) {
//       return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
//   }
// });

// LOGIN a user
router.post("/login", async (req, res) => {
  try {
    console.time("User Query Time");
    const user = await User.findOne({ email: req.body.email }).select(
      "email passwordHash isAdmin"
    );
    console.log(user); // Make sure isAdmin is present
    console.timeEnd("User Query Time");

    const secret = process.env.SECRET_KEY;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.time("Password Compare Time");
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );
    console.timeEnd("Password Compare Time");

    if (isPasswordValid) {
      console.time("JWT Sign Time");
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        secret,
        { expiresIn: "1d" }
      );
      console.timeEnd("JWT Sign Time");

      return res.status(200).send({ user: user.email, token: token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
});

router.post(`/register`, async (req, res) => {
  try {
    // Create a new user with the provided data
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10), // Hash the password with a salt of 20 rounds
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    const isUser = await User.findOne({ email: req.body.email });

    if (isUser) {
      return res.json({
        error: true,
        message: "User Already Exist...!",
      });
    }

    // Save the user to the database
    user = await user.save();

    // If the user could not be created
    if (!user) {
      return res.status(400).send("The user cannot be created");
    }

    // Respond with the created user data excluding the password and a 201 status code
    res
      .status(201)
      .send({
        name: user.name,
        email: user.email,
        phone: user.phone,
        street: user.street,
        apartment: user.apartment,
        zip: user.zip,
        city: user.city,
        country: user.country,
      });
  } catch (err) {
    // Handle any other errors
    res.status(500).send({ message: err.message });
  }
});

// DELETE a user by ID
router.delete("/:id", async (req, res) => {
  try {
    // Attempt to find and delete the user by ID
    const user = await User.findByIdAndDelete(req.params.id);

    // If the user is found and deleted, send a success response
    if (user) {
      return res.status(200).json({ success: true, message: "user deleted" });
    } else {
      // If the user is not found, send a 404 response
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }
  } catch (err) {
    // Handle any errors during the operation
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET the total count of users
router.get(`/get/count`, async (req, res) => {
  try {
    // Count the total number of users in the database
    const usersCount = await User.countDocuments();

    // Send the product count in the response
    res.status(200).send({
      usersCount: usersCount,
    });
  } catch (err) {
    // Handle any errors during the operation
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
