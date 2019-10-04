'use strict';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../keys/jwtOptions');
const pathPrivateKey = path.resolve('keys/', 'private.key')

const privateKEY = fs.readFileSync(pathPrivateKey, 'utf8');

module.exports = function sentJWT(userdata) {
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
    const signOptions = jwtOptions;
    return new Promise(async (resolve, reject) => {
        jwt.sign(payload, privateKEY, signOptions, (error, token) => {
            if (error) reject(new Error(`JWT promise rejected \n ${error}`));
            else resolve({ token });
        });
    });
}