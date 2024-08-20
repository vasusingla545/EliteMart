const express= require("express")
const app=express();
const cookieParser=require("cookie-parser");

const ErrorMiddleware=require("./middleware/error");
app.use(express.json())
app.use(cookieParser());

//Routes imports
const product=require("./routes/productRoute");
const user=require("./routes/userRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);

app.use(ErrorMiddleware);

module.exports=app
