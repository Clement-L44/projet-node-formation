const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, `A product must have a name`],
        unique: true,
    },
    brand : String,
    product_id: {
        type: Number,
        required: [true, 'A product must have a product id'],
        unique: true,
    },
    quantity: {
        type: Number,
        default: 5,
    },
    price: {
        type: Number,
        require: [true, 'A product must have a price'],
    },
    description: {
        type: String,
        trim: true,
    },
    weight: Number,
    picture_1: {
        type: String,
        required: [true, 'A product must have a picture']
    },
    picture_2: String,
    picture_3: String,
    madein: String,
    material: String,
    category: String,
    sub_category: String,
    season: {
        type: String,
        enum: {
            values: ["Spring/Summer", "All Year"],
            message: "Season must be Spring/Summer or All Year", 
        }
    },
    color: String,
    bicolor: String,
    genre: {
        type: String,
        enum: {
            values: ["Women", "Men"],
            message: "Genre must be Women or Men"
        }
    }
    
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;