
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

/* -------------------------------------------------------------------------- */
/*                             Create a JWT Token                             */
/* -------------------------------------------------------------------------- */

const createJWTToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createAndSendJWTToken = (user, statusCode, res) => {
    const token = createJWTToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

/* -------------------------------------------------------------------------- */
/*                                   SIGNUP                                   */
/* -------------------------------------------------------------------------- */

exports.signup = catchAsync(async (req, res, next) => {

    // 1) Create User
    const newUser = await User.create(req.body);
    createAndSendJWTToken(newUser, 201, res);

});

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    // 1) Check if email and password provided
    if(!email || !password){
        return next(new AppError('Please provide a valid email and password', 400));
    }
    // 2) Check if email and password user is correct
    const user = await User.findOne({ email }).select('password');
    if(!user) {
        return next(
            new AppError(
                'Incorrect email',
                401
            )
        );
    }

    // 3) If everything is correct, send token to client
    const correct = await user.correctPassword(password, user.password);
    if(!user || !correct){
        return next(new AppError('Incorrect password', 401));
    }
    createAndSendJWTToken(user, 200, res);
});

/* -------------------------------------------------------------------------- */
/*                                  PROTECTED                                  */
/* -------------------------------------------------------------------------- */

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // 1) Getting token and check of it's here
    if(req.headers.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    } 

    if(!token){
        //FIXME: Doesn't send message
        return next(
            new AppError('You are not logged in! Please log in to get access', 401)
        );
    }
    // 2) Verification Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(
            new AppError('The user belongs to this token does not exist', 401)
        );
    }

    // 4) Check if user changed password after the token was issued
    // iat is the token's date created from decoded variable
    if(cuurentUser.changePasswordAfter(decoded.iat)){
        return next(
            new AppError('User recently changed password ! Please log in again', 401)
        );
    }

    // 5) If everything is correct, send user data
    req.user = currentUser;

    next();
});

/* -------------------------------------------------------------------------- */
/*                                 RESTRICT TO                                */
/* -------------------------------------------------------------------------- */

exports.restrictTo = (...roles) => {
    return (req, res, next){
        // If user's role is not includes to roles restriction failed
        if(roles.include(req.user.roles)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    }
}

/* -------------------------------------------------------------------------- */
/*                               UPDATE PASSWORD                              */
/* -------------------------------------------------------------------------- */

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { passwordCurrent, password, passwordConfirm } = req.body;

    // 1) Get user from collection DB
    const user  =  await User.findById(req.user.id).select("+password");

    // 2) Check if current password (text entered by user) matches to password from collection DB
    const checkPasswordCurrent = await user.correctPassword(
        passwordCurrent,
        user.password
    );
    if(!checkPasswordCurrent){
        return next(
            new AppError('Your current password ')
        )
    }

    // 3) If good, update password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    // 4) Log User an send JWT Token 
    createAndSendJWTToken(user, 200, res);

});