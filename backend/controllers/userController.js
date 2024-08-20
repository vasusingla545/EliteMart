 const ErrorHandler=require("../utils/errorhandler");
 const catchAsyncError=require("../middleware/catchAsyncError");
 const User=require("../Models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto=require("crypto");
const sendEmail = require("../utils/sendEmail");

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

    //checking if user has given passowrd and email both
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

 //LOGOUT USER
 exports.logout=catchAsyncError(async(req,res,next)=>{
   
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
      success:true,
      message:"Logged Out"
    })
 });

 //FORGOT PASSWORD
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
  //Reset Password
  exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHander(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHander("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

  //Get User Details
  exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
     res.status(200).json({
      success:true,
      user,
     })
  })

  //Update Password
  exports.updatePassword=catchAsyncError(async (req,res,next)=>{

    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
      return next(new ErrorHandler("Old password is incorrect",400));

    }
    if(req.body.newPassword!==req.body.confirmPassword){
      return next(new ErrorHandler("password does not match",400));
    }
    user.password=req.body.newPassword;
   await user.save();
  sendToken(user,200,res);

  });

  //Update user profile
  exports.updateUserProfile=catchAsyncError(async(req,res,next)=>{

    const newUserData={
      name:req.body.name,
      email:req.body.email,
    };
    //cloudinary I will add later
    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    })
    res.status(200).json({
      success:true,
    });
  });

  //Get All Users--(ADMIN)
  exports.getAllUser=catchAsyncError(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
      success:true,
      users,
    })
  })

  //Get Single User--(ADMIN)
  exports.getSingleUser=catchAsyncError(async(req,res,next)=>{

    const user= await User.findById(req.params.id);

    if(!user){
      return next(new ErrorHandler(`User does not exist with id:${req.params.id}`))
    }
    res.status(200).json({
      success:true,
      user,
    })
  })

  //Update User Role---(ADMIN)
  exports.updateUserRole=catchAsyncError(async(req,res,next)=>{

    const newUserData={
      name:req.body.name,
      email:req.body.email,
      role:req.body.role,
    };
    
    const user= await User.findByIdAndUpdate(req.params.id,newUserData,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    })
    res.status(200).json({
      success:true,
    });
  });

  //DELETE User---(ADMIN)
  exports.deleteUser=catchAsyncError(async(req,res,next)=>{

   const user=await User.findById(req.params.id);
    if(!user){
      return next(new ErrorHandler(`User does not exist with id:${req.params.id}`))
    }

    await user.deleteOne();
 //We will remove cloudinary later
    res.status(200).json({
      success:true,
      message:"User has been deleted successfully",
    });
  });