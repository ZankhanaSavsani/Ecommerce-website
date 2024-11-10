const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Helper function to generate OTP
const generateOTPWithExpiry = () => ({
  otp: Math.floor(100000 + Math.random() * 900000).toString(),
  expiresIn: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
});

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Your Company" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP for email verification is ${otp}.`,
  };

  await transporter.sendMail(mailOptions);
};

// Helper function to send email
const sendContactEmail = async (contactData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,  // Optional: Might help with connection issues
    },
  });

  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL, // Set this to your preferred email address
    subject: "New Contact Form Submission",
    text: `You have received a new message from ${contactData.username} (${contactData.email}):\n\n${contactData.message}`,
  };

  await transporter.sendMail(mailOptions);
};

// POST route to handle contact form submission
router.post("/contact", async (req, res) => {
  const { username, email, message } = req.body;

  // Check if required fields are present
  if (!username || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // Send email using the helper function
    await sendContactEmail({ username, email, message });
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message." });
  }
});

// Send verification email function
// async function sendVerificationEmail(email, token) {
//   try {
//     // Create a transporter object using nodemailer with Ethereal credentials
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com.",
//       port: 587,
//       secure: false, // true for port 465, false for other ports
//       auth: {
//         user: 'savsanizankhana123@gmail.com',
//         pass: 'tcww awqa tgkl nzsq' // Your Ethereal test password
//       },
//     });

//     const mailOptions = {
//       from: '"Gokul Seed Tech Pvt Ltd" <savsanizankhana123@gmail.com>', // sender address
//       to: email, // recipient email
//       subject: "Email Verification", // Subject line
//       text: `Please verify your email by clicking the following link: http://localhost:5000/api/v1/users/verify-email/${token}`, // plain text body
//       html: `<b>Please verify your email by clicking the following link: <a href="http://localhost:5000/api/v1/users/verify-email/${token}">Verify Email</a></b>`, // HTML body
//     };

//     // Send the email and log the message ID
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Message sent: %s", info.messageId);
//   } catch (err) {
//     console.error("Error sending email: ", err);
//     throw new Error("Failed to send verification email.");
//   }
// }

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
      return res.status(404).json({
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
// router.post(`/`, async (req, res) => {
//   try {
//     // Validation: Check if required fields are provided
//     const { name, email, password, phone } = req.body;
//     if (!name || !email || !password || !phone) {
//       return res
//         .status(400)
//         .send({ message: "Please provide all required fields." });
//     }

//     // Check if the user with the provided email already exists
//     const isUser = await User.findOne({ email: req.body.email });

//     if (isUser) {
//       return res.status(400).json({
//         error: true,
//         message: "User Already Exists...!",
//       });
//     }

//     // Hash the password asynchronously
//     const passwordHash = await bcrypt.hash(req.body.password, 10);

//     // Create a new user object
//     let users = new User({
//       name: req.body.name,
//       email: req.body.email,
//       passwordHash, // Store the hashed password
//       phone: req.body.phone,
//       isAdmin: req.body.isAdmin,
//       street: req.body.street,
//       apartment: req.body.apartment,
//       zip: req.body.zip,
//       city: req.body.city,
//       country: req.body.country,
//     });

//     // Save the user to the database
//     users = await users.save();

//     if (!users) {
//       return res.status(500).send("The user cannot be created");
//     }

//     // Exclude sensitive fields from the response
//     const { passwordHash: _, ...userWithoutPassword } = users.toObject();

//     // Respond with the created user and a 201 status code
//     res.status(201).send(userWithoutPassword);
//   } catch (err) {
//     // Log and handle errors
//     console.error("Error creating user:", err);
//     res
//       .status(500)
//       .send({ message: "Internal Server Error", error: err.message });
//   }
// });

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
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// // Registration route
// router.post(`/register`, async (req, res) => {
//   try {
//     // Check if the user already exists
//     const isUser = await User.findOne({ email: req.body.email });
//     if (isUser) {
//       return res.json({
//         error: true,
//         message: "User Already Exist...!",
//       });
//     }

//     // Generate a verification token with JWT
//     const verificationToken = jwt.sign({ email: req.body.email, name: req.body.name }, process.env.SECRET_KEY, { expiresIn: '1h' });

//     // Create a new user with the provided data but don't set them as verified
//     let user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       passwordHash: bcrypt.hashSync(req.body.password, 10), // Hash the password
//       phone: req.body.phone,
//       isAdmin: req.body.isAdmin,
//       street: req.body.street,
//       apartment: req.body.apartment,
//       zip: req.body.zip,
//       city: req.body.city,
//       country: req.body.country,
//       isVerified: false, // User is not verified yet
//       verificationToken,  // Save the verification token in the user document
//     });

//     // Save the user to the database
//     user = await user.save();

//     // If the user could not be created
//     if (!user) {
//       return res.status(400).send("The user cannot be created");
//     }

//     // Send the verification email
//     await sendVerificationEmail(req.body.email, verificationToken);

//     // Respond with the created user data excluding the password and notify about verification
//     res.status(201).send({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       street: user.street,
//       apartment: user.apartment,
//       zip: user.zip,
//       city: user.city,
//       country: user.country,
//       message: 'Registration successful! Please check your email for verification.',
//     });
//   } catch (err) {
//     // Handle any other errors
//     res.status(500).send({ message: err.message });
//   }
// });

// Registration route with OTP-based verification
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      street,
      apartment,
      zip,
      city,
      country,
      isAdmin,
    } = req.body;

    // Check if the user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.json({
        error: true,
        message: "User Already Exists!",
      });
    }

    // Generate a 6-digit OTP
    const { otp, expiresIn } = generateOTPWithExpiry();

    // Hash the OTP before saving to the user document
    const otpHash = await bcrypt.hash(otp, 10);

    // Create a new user but not verified yet
    let user = new User({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10), // Hash the password
      phone,
      street,
      apartment,
      zip,
      city,
      country,
      isAdmin,
      isVerified: false, // Not verified yet
      otpHash, // Save the OTP hash
      otpExpiresIn: expiresIn,
    });

    // Save the user to the database
    user = await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).send({
      message:
        "Registration successful! OTP sent to your email for verification.",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// OTP verification route
router.post("/verify-otp", async (req, res) => {
  console.log("Verify OTP route hit");
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found.");
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).send("User already verified.");
    }

    // Debugging log to check the flow of verification
    console.log("Checking user verification...");

    if (Date.now() > user.otpExpiresIn) {
      console.log("OTP expired."); // Log if OTP is expired
      return res.status(400).send("OTP has expired.");
    }

    // Debugging logs for OTP comparison
    console.log("User entered OTP:", otp);
    console.log("Stored otpHash:", user.otpHash);

    // Compare the OTP
    const isOtpMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isOtpMatch) {
      console.log("OTP did not match.");
      return res.status(400).send("Invalid OTP.");
    }

    // Mark the user as verified and clear the OTP hash
    user.isVerified = true;
    user.otpHash = null; // Clear the OTP hash after verification
    user.otpExpiresIn = null;
    await user.save();

    res.status(200).send("Email verified successfully.");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Email verification route
// router.get('/verify-email/:token', async (req, res) => {
//   const token = req.params.token;

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     const { email } = decoded;

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).send('User not found.');
//     }

//     // If the user is already verified
//     if (user.isVerified) {
//       return res.status(400).send('Email already verified.');
//     }

//     // Mark the user as verified and save
//     user.isVerified = true;
//     user.verificationToken = null; // Optionally, remove the token
//     await user.save();

//     res.status(200).send('Email verified successfully.');
//   } catch (err) {
//     res.status(400).send('Invalid or expired token.');
//   }
// });

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
