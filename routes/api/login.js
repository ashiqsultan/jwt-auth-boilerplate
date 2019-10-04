const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../model/User')
const router = express.Router();
const sendJWT = require('../../microservices/sendJWT')


/*
@route  POST api/login
@desc   Login route, Given username and password this sends a JWT token
@access Public
*/
router.post(
    '/',
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
            } else {
                res.json(await sendJWT(user)); // this will send the token as a json
            }
        } catch (error) {
            console.error(`Error catched on post request ${error.message}`);
            res.status(500).send('Server Error');
        }
    })

module.exports = router;