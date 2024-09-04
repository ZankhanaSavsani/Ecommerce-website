const express = require('express');
const router = express.Router();
const { User } = require('../models/user'); 
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');

// GET all users
router.get(`/`, async (req, res) => {
  try {
    // Fetch all users, excluding their password hashes
    const userList = await User.find().select('-passwordHash');

    // Check if users were found
    if (!userList) {
      return res.status(500).json({ success: false, message: "No users found." });
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
    const user = await User.findById(req.params.id).select('-passwordHash');

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ success: false, message: "The user with the given ID was not found." });
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
    // Create a new user with the provided data
    let users = new User({
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

    const isUser = await User.findOne({email: req.body.email})

    if (isUser) {
        return res.json({
            error: true,
            message: "User Already Exist...!"
        });
    }

    // Save the user to the database
    users = await users.save();

    // If the user could not be created
    if (!users) {
      return res.status(500).send("The user cannot be created");
    }

    // Respond with the created user and a 201 status code
    res.status(201).send(users);
  } catch (err) {
    // Handle any other errors
    res.status(500).send({ message: err.message });
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
router.post('/login', async (req, res) => {
  try {
    console.time('User Query Time');
    const user = await User.findOne({ email: req.body.email }).select('email passwordHash');
    console.timeEnd('User Query Time');

    const secret = process.env.SECRET_KEY;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.time('Password Compare Time');
    const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
    console.timeEnd('Password Compare Time');

    if (isPasswordValid) {
      console.time('JWT Sign Time');
      const token = jwt.sign(
        { userId: user.id },
        secret,
        { expiresIn: '1d' }
      );
      console.timeEnd('JWT Sign Time');

      return res.status(200).send({ user: user.email, token: token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

module.exports = router;
