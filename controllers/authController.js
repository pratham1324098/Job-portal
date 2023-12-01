const errorMiddleware = require("../middlewares/errorMiddleware");
const userModel =  require("../models/userModel")
const JWT = require("jsonwebtoken")
const registerController = (async(req,res,next) =>{
const {name,email,password,lastName} = req.body
        if(!name){
            next("Name is Required");
            // return res.status(400).send({success:false,message:"Please provide Name"})
        }
        if(!email){
            next("Email is Required");
            // return res.status(400).send({success:false,message:"Please provide Email"})
        }
        if(!password){
            next("Password is Required");
            // return res.status(400).send({success:false,message:"Please provide Password"})
        }
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            next("Email Already Register Please Login")
            
        }
        const user = await userModel.create({name,email,password,lastName});
        const token = user.createJWT();
        res.status(201).send({
            success:true,
            message:"User created Successfully",
            user:{
                name:user.name,
                lastName:user.lastName,
                email:user.email,
                location:user.location,
            },
            token,
        })
        // console.log(token);
 })
 const loginController = async(req,res,next) =>{
    const {email,password} = req.body;
    if(!email||!password){
        next("Please provide all Fields")
    }
    const user =await userModel.findOne({email}).select("+password")
    if(!user){
        next("Invalid Username or password")
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        next("Invalid Username or Password");
    }
    user.password=undefined;
    const token = user.createJWT();
    res.status(200).json({
        success:true,
        message:"LOGIN SUCCESSFULLY",
        user,
        token,
    });
 };
 module.exports = {registerController,loginController};
