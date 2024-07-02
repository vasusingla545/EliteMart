const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database")

//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
})
dotenv.config({path:"backend/config/config.env"})
connectDatabase()

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


//Unhandled PRomise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down server due to unhandled rRomise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});