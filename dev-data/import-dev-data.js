const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

const Product = require('../models/productModel');

//DotEnv Config
dotenv.config();

//Connect to MongoDB
const MONGODB = process.env.MONGODB_DATABASE.replace(
    '<PASSWORD>', 
    process.env.MONGODB_PASSWORD
);

mongoose
    .connect(MONGODB)
    .then(() => console.log('DB connection successful !'));

//READ JSON FILE (PRODUCTS.JSON)
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, 'uft-8')
);

//IMPORT DATA TO MONGODB
const importData = async () => {
    try{
        await Product.create(products);
        console.log('Data successfully loaded');
    } catch (error){
        console.log(error);
    }
    // CLOSE SERVER
    process.exit();
}

//DELETE ALL DATAS FROM MONGODB
const deleteAllData = async () => {
    try{
        await Product.deleteMany();
        console.log('Data successfully deleted');
    } catch (error){
        console.log(error);
    }
    //CLOSE SERVER
    process.exit();
}

//RETURN AN ARRAY O FINSTRUCTION USING IN THE TERMINAL

if(process.argv[2] === '--import') importData();
if(process.argv[2] === '--delete') deleteAllData();