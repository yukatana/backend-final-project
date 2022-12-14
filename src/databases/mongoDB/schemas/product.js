const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String, required: false},
    thumbnail: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, default: 0}
}, {timestamps: true})

const Product = model('products', ProductSchema)

module.exports = Product
