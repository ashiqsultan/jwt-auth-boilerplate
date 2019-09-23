const express = require('express');
const User = require('../../model/User')
const auth = require('../../middleware/auth')
const router = express.Router();


/*
@route  GET api/protectedRoute
@desc   
This is a demo to check protected route.
We are passing our auth middleware to check whether the JWT token is valid.
This send responce only if the token is valid, else the our auth middleware will respond forbidden 
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