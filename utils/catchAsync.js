
//Gestion error : remplace le try catch
const catchAsync = (fn) => {
    return function (req,res,next) {
        // fn example : function createProduct
        fn(req,res,next).catch(err => {
            next(err);
        });
    }
}

module.exports = catchAsync;