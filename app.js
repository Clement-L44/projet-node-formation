
const fs = require('fs');
const morgan = require('morgan');
const dotenv = require('dotenv');

//Express
const express = require('express');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//Env Config
dotenv.config();

// Allow us to use request body
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Routes
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

app.all("*", (req,res) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;