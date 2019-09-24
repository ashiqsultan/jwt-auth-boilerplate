'use strict';
const fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../keys/jwtOptions');

/* The functionality of this middleware is to get the token from the header and check whether is it a valid token.
If the token is valid the next middleware in the stack is called else Status 401 is sent
*/

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('our-app-token'); // KEY, the token should be sent in the header with this key

    if (!token) {
        return res.status(401).json({ message: 'No Token, Authorization denied' });
    }

    try {
        const pathPublicKey = path.resolve('keys/', 'public.key')
        const publicKEY = fs.readFileSync(pathPublicKey, 'utf8');

        const verifyOptions = jwtOptions;
        
        let decoded = jwt.verify(token, publicKEY, verifyOptions);
        req.userdata = decoded.user;
        next();
    } catch (error) {
        //console.log(error.mesage)
        res.status(401).json({ message: 'Token is not valid' });
    }
}

