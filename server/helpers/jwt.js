const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
// Middleware function to protect routes
function authJwt() {
    const secret = process.env.SECRET_KEY; // Your JWT secret key from environment variables
    const api = process.env.API_URL;
    return expressjwt({
      secret,
      algorithms: ['HS256'],
      isRevoked: isRevoked
    }).unless({
      // Specify routes that do not require authentication
      path: [
        { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/css\/(.*)/, methods: ['GET', 'OPTIONS'] },  
        { url: /\/images\/(.*)/, methods: ['GET', 'OPTIONS'] },
        // { url: /\/api\/v1\/products/\category(.*)/, methods: ['GET', 'OPTIONS']},
        { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/users\/verify-email(.*)/, methods: ['GET', 'OPTIONS'] },
        `${api}/users/login`, // Exclude login route
        `${api}/users/register`, // Exclude register route
        `${api}/users/verify`
      ]
    });
  }

  async function isRevoked(req, token) {
    // Access the nested payload property
    const payload = token.payload;

    // Check if the user is an admin based on the token's payload
    if (payload.isAdmin !== true) {
        return Promise.resolve(true); // Revoke token for non-admin users
    }

    return Promise.resolve(false); // Allow token for admin users
}

  
  
  

module.exports = authJwt;
