import mongoose from 'mongoose';

//  collection for carts
const cartCollection = 'carts';

//  define the schema for a cart
const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            quantity: { type: Number, default: 1 }
        }
    ]
});

//  middleware to populate products on `findOne`
cartSchema.pre('findOne', function () {
    this.populate('products.productId');
});

const Cart = mongoose.model(cartCollection, cartSchema);

export default Cart;
