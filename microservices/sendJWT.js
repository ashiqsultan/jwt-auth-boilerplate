const jwt = require('jsonwebtoken');
require('dotenv').config();

const TOKENSECRET = process.env.JWT_SECRET;
const EXPIRESIN = "2 days"

async function sentJWT(res, userdata) {
    //Initiate a Payload to be sent with JWT
    //You can send anything in the token, in this example we are sending only user id and email we got from database
    const payload = {
        user: {
            id: userdata.id,
            email: userdata.email
        }
    };
    try {
        jwt.sign(
            payload,
            TOKENSECRET,
            { expiresIn: EXPIRESIN },
            (error, token) => {
                if (error) { throw error };//throw error if our jwt sign goes wrong
                res.json({ token }); // Send the JWT
                console.log('Token sent!');
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}
module.exports = sentJWT;