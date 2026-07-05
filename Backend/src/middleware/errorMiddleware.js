const errorHandler = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;

    let message = err.message || "Internal Server Error";

    // Mongoose Invalid ObjectId
    if(err.name === "CastError"){
        statusCode = 400;
        message = "Invalid ID";
    }

    // Duplicate Key
    if(err.code === 11000){
        statusCode = 409;
        message = "Resource already exists";
    }

    // Validation Error
    if(err.name === "ValidationError"){
        statusCode = 400;
        message = Object.values(err.errors)
            .map(val => val.message)
            .join(", ");
    }

    // JWT Error
    if(err.name === "JsonWebTokenError"){
        statusCode = 401;
        message = "Invalid Token";
    }

    // JWT Expired
    if(err.name === "TokenExpiredError"){
        statusCode = 401;
        message = "Token Expired";
    }

    res.status(statusCode).json({
        success:false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack:err.stack
        })
    });

}

module.exports = errorHandler;