const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user");

const router = express.Router();

// Admin login route
router.post("/login", async (req, res) => {
    try {
        console.time("User Query Time");
        const user = await User.findOne({ email: req.body.email }).select("email passwordHash isAdmin");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("User found:", user); // Log the user object to verify
        console.timeEnd("User Query Time");

        console.time("Password Compare Time");
        const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
        console.timeEnd("Password Compare Time");

        if (isPasswordValid) {
            console.time("JWT Sign Time");
            const token = jwt.sign(
                { userId: user.id, isAdmin: user.isAdmin },
                process.env.SECRET_KEY,
                { expiresIn: "1d" }
            );
            console.timeEnd("JWT Sign Time");

            return res.status(200).send({ user: user.email, token: token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
    } catch (error) {
        console.error("Error during login:", error);  // Log the specific error
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,  // Send detailed error message back in the response
        });
    }
});

module.exports = router;
