const mongoose= require("mongoose");

const productSchema=mongoose.Schema({
    name:{ 
        type:String,
        required:[true,"Please Enter product Name"]
    },
    description:{
        type:String,
        required:[true,"Pkease enter the product description"]
    },
    price:{
        type:Number,
        required:[true,"Pkease enter the product price"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Pkease enter Product Category"]
    },
     Stock:{
        type:Number,
        required:[true,"Please enter Product stock"],
        maxLength:[4,"Stock cannot exceed four characters"],
        default:1
     },
     numofReviews:{
        type:Number,
        default:0
     },
     reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
     ],
     createdAt:{
        type:Date,
        default:Date.now
     }
})
module.exports=mongoose.model("Product",productSchema);