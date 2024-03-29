const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');
const  User=require('../models/User');
const { generateToken } = require('../middleware/auth');


// register user
exports.register=async(req,res)=>{
    try {
        // fetch data
        const {
          
            email,
            password,
            image,
            picturePath,
          
        }=req.body;

        // validation
        if(!(email || password)){
            return res.status(403).json({
                success:false,
                message:"all fields are required",
            }) 
        };

        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);

        //  create new user
        const newUser=await User.create({
            email,
            password:passwordHash,
           

        });

        // payload
        const payload={
            id:newUser.id,
            email:newUser.email

        }
        console.log(payload)
        const token = generateToken(newUser.email);
        console.log("token is :",token);

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            data:newUser,
            token:token,
          
           
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// logging in
exports.login = async(req,res)=>{
  try {
    // fetch data
    const {email,password}=req.body;
    const user=await User.findOne({email});

    // check for user existence
    if(!user){
        return res.status(400).json({
            success: false,
            message:"user does not exists",
        })
    }

    // pass match
    const isMatch= await bcrypt.compare(password,user.password);

    // if passowr matched
    if(!isMatch){
        return res.status(400).json({
            success: false,
            message:"Invalid creadentials",
        })
    }

    // gen token
    const payload={
        id: user.id,
        email: user.email,
    }

    const token = generateToken(payload);

    // res
     res.json({
        token
     })
  } catch (error) {
    res.status(500).json({
        error:err.message,
    })
  }
}


// Fetch logged-in user based on verified token and decoded payload
exports.getLoggedInUser = async (req, res) => {
    try {
        // Extract user data from request object
        const userData = req.user;

        // Extract user ID from user data
        const userId = userData.id;
        console.log("userid is:=>",userId);

        // Find user by ID
        const user = await User.findById(userId);

        // If user is found, return the user data
        if (user) {
            return res.status(200).json({ success: true, user });
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        // Handle errors
        return res.status(500).json({ success: false, error: error.message });
    }
}
