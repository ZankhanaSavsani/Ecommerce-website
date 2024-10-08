const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as per your project structure

// Middleware to check if the user is verified
const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided!' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before accessing this resource.' });
    }

    // Attach user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token.' });
  }
};

module.exports = verifyUser;
