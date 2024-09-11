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
        { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        `${api}/users/login`, // Exclude login route
        `${api}/users/register` // Exclude register route
      ]
    });
  }

  async function isRevoked(req,payload, done){
     // Check if the user is an admin based on the token's payload
    if(!payload.isAdmin){
      // If the user is not an admin, revoke the token
      return done(null, true);
    }
    // If the user is an admin, allow the token to proceed
    done();
  }

module.exports = authJwt;
