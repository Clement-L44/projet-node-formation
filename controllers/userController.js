const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


//Controllers

exports.getAllUsers = catchAsync( async (req, res, next) => {

    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        }
    });
});

exports.getUser = catchAsync( async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new AppError('No user found with this ID !', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {user},

    });
});

exports.createUser = (req, res) => {

    res.status(500).json({
        status: 'fail',
        message: 'This route is not yet definied'
    });
};

exports.updateUserData = catchAsync( async (req, res, next) => {
    const { password, passwordConfirm} = req.body;

    // 1) If user try to update his passord send a error message
    if(password || passwordConfirm){
        return next(
            new AppError(
                'This route is not for password update. Please use this route: /updatePassword',
                400
            )
        );
    }

    // 2) Update user data
    const updateUser = await User.findByIdAndUpdate(
        req.user.id, 
        { name, email }, 
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: 'success',
        data: { user : updateUser}
    });

});

exports.deleteMe = catchAsync (async (req, res) => {

    await User.findByIdAndUpdate(req.user.id, { active: false});

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.deleteUser = catchAsync(async (req, res) => {

    // 1) Get the user using req params and delete
    const user = await User.findByIdAndDelete(req.params.id);

    // 2) If user is not found send a error message
    if(!user){
        return next(
            new AppError('No user found with this ID !', 404)
        );
    }

    // 3) If user is found send a success message
    res.status(204).json({
        status: 'success',
        data: null,
    });

});