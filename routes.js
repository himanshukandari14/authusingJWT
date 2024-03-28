// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth');
const { register, login, getUser} = require('../controllers/Auth');
const User = require('../models/User');

// Register a new user
router.post('/register', register);

// Log in an existing user
router.post('/login', login);

// Protected route requiring token verification
router.get('/getallusers',verifyToken,async (req, res) => {
    try {
        const data=await User.find({});
        console.log('data fetched');
        res.status(200).json({data})

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'internal server error'})
    }
});

router.get('/profile',verifyToken,getUser)
module.exports = router;
