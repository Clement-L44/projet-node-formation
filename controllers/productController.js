const fs = require('fs');
const { find } = require('../models/productModel');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const products = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/products-simple.json`, 'utf-8'));

//Controllers

exports.getAllProducts = catchAsync(async (req,res) => {

    const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    ;

    const products = await query;

    res.status(200).json({
        status: 'success',
        result: products.length,
        data: { products },
    });

});

exports.getProduct =  catchAsync(async (req,res) => {

    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new AppError('No product found with this ID !', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { product },
    });

});

exports.createProduct = catchAsync(async (req, res, next) => {

    const product = await Product.create(req.body);
    res.status(200).json({ status: 'success', data: { products } });
    
});

exports.updateProduct = catchAsync(async (req, res) => {

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });       
    if(!product){
        return next(new AppError('No product found with this ID !', 404));
    } 
    res.status(200).json({ status: 'success', data: { product: '<Update product>' } }); 

});

exports.deleteProduct = catchAsync(async (req, res) => {

    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
        return next(new AppError('No product found with this ID !', 404));
    }
    res.status(204).json({ status: 'success', data: null });
    
});
