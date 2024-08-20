const User=require("../Models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsynErrors=require("./catchAsyncError");
const jwt= require("jsonwebtoken");

exports.isAuthenticatedUser=catchAsynErrors( async(req,res,next)=>{
const {token} =req.cookies;

//if we do not get any token
if(!token){
    return next(new ErrorHandler("Please login to access this resource",401));
}
//veryfying if token is correct or not
const decodedData= jwt.verify(token,process.env.JWT_SECRET);
req.user= await User.findById(decodedData.id);
next();
});

//Authorize Roles
exports.authorizeRoles=(...roles)=>{
    return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resource`,403
        )
    );
    
    }
    next();
};
};