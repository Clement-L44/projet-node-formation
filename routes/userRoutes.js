const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post(
    '/updatePassword', 
    authController.protect,
    authController.updatePassword
);
router.post(
    '/updateMe',
    authController.protect,
    userController.updateUserData
);
router.post(
    '/deleteMe',
    authController.protect,
    userController.deleteMe
);

router.post(
    '/deleteUser/:id',
    authController.restrictTo('admin'),
    userController.deleteUser
);

//User Routes
router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
;

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
;

module.exports = router;