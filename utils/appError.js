class AppError extends Error{

    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        //Convert in string and if start '4' == 'fail' : 'error'
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        this.isOperationnal = true; //IS NOT A LIBRARY

        Error.captureStackTrace(this, this.constructor);
    }



}