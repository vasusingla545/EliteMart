 const ErrorHandler=require("../utils/errorhandler");
 const catchAsyncError=require("../middleware/catchAsyncError");
 const User=require("../Models/userModel");
const sendToken = require("../utils/jwtToken");

 //Register a User
 exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const{name,email,password}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is sample id",
            url:"profilepic",
        }
    });
    sendToken(user,201,res);
 });

 //LOGIN USER
 exports.loginUser=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;

    //checking if user has given passowrd and email bpoth
    if(!email || !password){
        return next(new ErrorHandler("Pleae Enter both Email and Password",400));

    }
    const user= await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or passowrd",401));
        
    }
    sendToken(user,200,res);

 })