const ErrorHandler=require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error";

    //Wrong MongoDB Id error
  

    res.status(err.statusCode).json({
        sucess:false,
        message:err.stack
    });
}