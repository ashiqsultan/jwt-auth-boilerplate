const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../model/User')
const router = express.Router();


/*
@route  POST api/login
@desc   Login route, Given username and password this sends a JWT token
@access Public
*/
router.post(
    '/login',
    //Validation Check middleware
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //Extracting data from the request body
        const { email, password } = req.body;

        try {
            // Getting User details from the provided email, if no email means no user so send error
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ message: 'Invalid Credentials' }] })
            }

            //If email exists then check password match
            // Comparing password by decrypting the password using bcryptjs
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //Initiate a Payload to be sent with JWT
            //You can send anything in the token, in this example we are sending only user id and email we got from database
            const payload = {
                user: {
                    id: user.id,
                    email: user.email
                }
            };

            //Return JSON Web Token
            jwt.sign(
                payload,
                process.env.JWT_SECTER,
                { expiresIn: "2 days" },
                (error, token) => {
                    if (error) throw error; //throw error if our jwt sign goes wrong
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    })

module.exports = router;