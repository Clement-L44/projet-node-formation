const AppError = require('../utils/appError');

//Handle invalid Database ID function
const handleCastErrorDB = (err) => {
    const messagee = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};

//Handle Duplicate Database fields
const handleDuplicateFieldsDB = (err) => {
    const value = JSON.stringify(err.keyValue)
    const message = `Duplicate fields: ${value}. Please use another value.`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((error) => error.messsage);
    const message = `Invalid input data .${errors.join('. ')}`;

    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack : err.stack,
    });
};

const sendErrorProd = (err, res) =>  {
    //Error we are defined
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong !',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //Development Error
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production'){
        let error = JSON.parse(JSON.stringify(err));

        //Handle invalid Database ID
        if(error.name === 'CastError'){
            error = handleCastErrorDB(error);
        }
        if(error.code === 11000){
            error = handleDuplicateFieldsDB(error);
        }
        if(error.name === 'ValidatorError'){
            error = handleValidationErrorDB(error);
        }

        // Production error
        sendErrorProd(error,res);
    }

};

