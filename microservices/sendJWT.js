'use strict';
const fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async function sentJWT(userdata, res) {
    //const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

    // PRIVATE and PUBLIC key
    let pathPrivateKey = path.resolve('keys/', 'private.key')
    let pathPublicKey = path.resolve('keys/', 'public.key')

    const privateKEY = fs.readFileSync(pathPrivateKey, 'utf8');
    const publicKEY = fs.readFileSync(pathPublicKey, 'utf8');

    const issuer = 'MyExampleCorp';   // Issuer 
    const subject = 'someuser@example.com'; // Subject 
    const audience = 'http://example.com';  // Audience
    const expiresIn = "12h" // Time the JWT will be valid
    const algorithm = "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]

    //make sure to include expiresIn the other options are optional
    let signOptions = {
        issuer: issuer,
        subject: subject,
        audience: audience,
        expiresIn: expiresIn,
        algorithm: algorithm
    }

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
            res.json({token})
        });
    } catch (error) {
        console.error("Error thrown by JWT Sign " + error);
        res.status(500).send('Server Error');
    }
}