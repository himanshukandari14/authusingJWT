const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');
const  User=require('../models/User');
const { generateToken } = require('../middleware/auth');


// register user
exports.register=async(req,res)=>{
    try {
        // fetch data
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        }=req.body;

        // validation
        if(!(firstName || lastName || email || password)){
            return res.status(403).json({
                success:false,
                message:"all fields are required",
            }) 
        };

        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);

        //  create new user
        const newUser=await User.create({
            firstName,
            lastName,
            email,
            password:passwordHash,
            // picturePath,
            // friends,
            // location,
            // occupation,
            // viewedProfile:Math.floor(Math.random * 1000),
            // impressions:Math.floor(Math.random * 1000),

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





// get user
exports.getUser=async(req,res)=>{
    try {
        const userData=req.user;
        console.log(userData);

        const userId=userData.id;
        const user= await User.findById(userId);

        return res.status(200).json({user});
    } catch (error) {
        res.status(500).json({
        error:err.message,
    })
    }
}