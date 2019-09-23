const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../model/User')

/*
@route  POST api/signup
@desc   Register User and sends a JWT on sucessful registration
@access Public
*/
router.post(
    '/signup',
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

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            //Get user Gravatar

            //Save the user to Database and Encrypt Password
            user = new User({
                name,
                email,
                password
            });
            //Encrypt Password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            // Save user data with encrypted password to database
            await user.save();

            //Return JSON Web Token
            const payload = {
                user: {
                    id: user.id,
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECTER,
                { expiresIn: "2 days" },
                (error, token) => {
                    if (error) throw error;
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    })

module.exports = router;