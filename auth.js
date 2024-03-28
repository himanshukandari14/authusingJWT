// middleware/verifyToken.js

const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (req, res, next) => {

    // first check that req header has authorization or not
    const authorization= req.headers.authorization;
    if(!authorization){
        return res.status(401).json(
            {
                error:'token not found'
            }
        );
    }
     const token = req.headers.authorization.split(' ')[1];
       console.log("token is ",token);
    try {
    //   verify jwt token
    const decoded=jwt.verify(token, process.env.JWT_SECRET);

    // attach user inform,ation to req obj
    req.user=decoded;
    next();

    } catch (error) {
        console.log(error)
        return res.status(403).json({ success: false, message: "Invalid token." });
    }
};


// func to generate token
const generateToken = (userData) => {
    return jwt.sign({userData},process.env.JWT_SECRET,{ 
        expiresIn:'2h'
    });

}
 module.exports={verifyToken,generateToken}
