import {Schema, model} from 'mongoose';

const productColecction = 'products'

// Product Model
const productsSchema = new Schema({
    title: String,
    description: String,
    code: {
        type: String,
        required: true,
        unique: true
    },  
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: {
        type: String,
        required: false
    }
})

export default model(productColecction, productsSchema)

