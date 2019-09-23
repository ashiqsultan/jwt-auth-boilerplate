const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../model/User')
const sentJWT = require('../../microservices/sendJWT')
const encryptPassword = require('../../microservices/encryptPassword')

/*
@route  POST api/signup
@desc   Register User and sends a JWT on sucessful registration
@access Public
*/
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //extracting data from the request body
        const { name, email, password } = req.body;

        try {
            //See if user exists
            let user = await User.findOne({ email });
            //If user already exists send error
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            //Save the user to Database and Encrypt Password
            user = new User({
                name,
                email,
                password
            });
            //Encrypt Password
            user.password = await encryptPassword(password);

            //Save User to DB
            await user.save();

            //Return JSON Web Token
            await sentJWT(res, user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    })

module.exports = router;