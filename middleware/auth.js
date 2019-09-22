const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECTER;

/* The functionality of this middleware is to get the token from the header and check whether is it still valid*/

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('our-app-token'); // the token should be sent in the header with this key

    if (!token) {
        return res.status(401).json({ message: ' No Token, Authorization denied smile' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded);
        req.userdata = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

