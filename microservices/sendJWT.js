'use strict';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../keys/jwtOptions');

module.exports = async function sentJWT(userdata, res) {
    console.log("sending JWT started")
    //const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

    // PRIVATE key
    const pathPrivateKey = path.resolve('keys/', 'private.key')
    const privateKEY = fs.readFileSync(pathPrivateKey, 'utf8');

    let signOptions = jwtOptions;

    //Initiate a Payload to be sent with JWT
    //You can send anything in the token, in this example we are sending only user id and email we got from database
    //but the more you add the more longer the token will be
    //So NETWORK LATENCY will be increased
    const payload = {
        user: {
            id: userdata.id,
            email: userdata.email
        }
    };
    try {
        jwt.sign(payload, privateKEY, signOptions, (error, token) => {
            if (error) { throw error };//throw error if our jwt sign goes wrong
            res.json({ token })
            console.log("sending JWT Completed")
        });
    } catch (error) {
        console.error("Error thrown by JWT Sign " + error);
        res.status(500).send('Server Error');
    }
}