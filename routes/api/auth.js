const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../model/User')
const auth = require('../../middleware/auth')


/*
@route  GET api/auth
@desc   Test route
@access Public
*/
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userdata.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //extracting data from the request body
        const { email, password } = req.body;

        try {
            // Compare the passwords to ensure
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ message: 'Invalid Credentials' }] })
            }

            //Comparing password 
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

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