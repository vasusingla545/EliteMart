const Product=require("../Models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

//Create a Product---only for ADMIN
exports.createProduct=catchAsyncError(async(req,res,next)=>{
    const product= await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })

});



//Get All products
exports.getAllProducts=catchAsyncError(async(req,res)=>{
    const resultPerPage=10;
    const apiFeature= new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
const productCount=await Product.countDocuments();
   
    const products=await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage
    })
})

//UPDATE PRODUCT(for ADMIN only)
exports.updateProduct=catchAsyncError(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);

    if(!product){
        // return res.status(500).json({   
        //     success:false,
        //     message:"Product not found"
        // })
        return next(new ErrorHandler("Product not found!!",404))
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
       success:true,
        product
    })
})

//DELETE PRODUCT

exports.deleteProduct=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

   
    if(!product){
        // return res.status(500).json({   
        //     success:false,
        //     message:"Product not found"
        // })
        return next(new ErrorHandler("Product not found!!",404))
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"Product has been deleted"

    })
})

//GET PRODUCT DETAILS
exports.getProductDetails=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    
    if(!product){
        // return res.status(500).json({   
        //     success:false,
        //     message:"Product not found"
        // })
        return next(new ErrorHandler("Product not found!!",404))
    }
    res.status(200).json({
        success:true,
        product

    })
})