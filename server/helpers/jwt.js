const { expressjwt } = require('express-jwt');


function authJwt(){
    const secret = process.env.SECRET_KEY;
    return expressjwt({
        secret,
        algorithms: ['HS256']
    })
}

module.exports = authJwt;