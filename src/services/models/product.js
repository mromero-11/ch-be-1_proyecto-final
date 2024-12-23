import mongoose from 'mongoose';

//  collection for products
const productCollection = 'products';

//  define the schema for a product
const productSchema = new mongoose.Schema({
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

//  create and export the model
const Product = mongoose.model(productCollection, productSchema);

export default Product;
