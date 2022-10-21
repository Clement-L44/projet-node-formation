const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    name: {
        type: String, 
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],

    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'employee'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide your password'],
        validate: {
            // El argument is the passwordConfirm field.
            // Works ONLY for creating or updating users.
            validator: function (el){
                return el === this.password;
            },
            message: 'Passwords are not the same',
        }
    },
    passwordChangedAt: Date,
    active: {
        type: boolean,
        default: true,
        select: false,
    },
    family: [
        {
          type: String,
          enum: ['father', 'mother'],
        },
      ],
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    // Hash password
    this.password = await bcrypt.hash(this.password, 12);
    // Delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre(/^find/, function(next) {
    // $ne means not equals to ...
    this.find({
        active: { $ne: false }
    });
    next();
});

//Compare the password entered by the user and the password database
userSchema.methods.correctPassword = async function(passwordEntered, userPassord) {
    return await bcrypt.compare(passwordEntered, userPassord);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        /* Si la date (time) de création de JWT est INFERIEUR
            à celui de changedTimestamp (créer quand utilisateur change son mot de passe)
            return true = le token de JWTT a été déjà utiliser
        */
        return JWTTimestamp < changedTimestamp;
        //true = JWTTimestamp a déjà été utlisé
        //false = JWTTimestamp n'a pas été utilisé
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
