const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
// Middleware function to protect routes
function authJwt() {
    const secret = process.env.SECRET_KEY; // Your JWT secret key from environment variables
  
    return expressjwt({
      secret,
      algorithms: ['HS256'],
      // Optional: Implement token revocation logic if needed
      isRevoked: async (req, token) => {
        // This function can be used to check if a token should be revoked
        // e.g., checking a blacklist or expired tokens
        return false; // Returning false means the token is not revoked
      }
    }).unless({
      // Specify routes that do not require authentication
      path: [
        '/api/v1/users/login', // Exclude login route
        '/api/v1/users/signup' // Exclude signup route if you have one
      ]
    });
  }

module.exports = authJwt;
