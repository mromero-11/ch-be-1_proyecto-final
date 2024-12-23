import Cart from "./models/cart.js";
import Product from "./models/product.js";

export default class CartService {
    /* API Methods */

    //  create a new empty cart
    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            return await newCart.save();
        } catch (error) {
            console.error('Error al crear carrito:', error.message);
            throw error;
        }
    }

    //  get cart by id
    async getCartById(cartId) {
        return await Cart.findById(cartId).exec();
    }

    //  add a product to the cart
    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            const productExists = await Product.findById(productId).exec();
            if (!productExists) {
                throw new Error('El producto que intenta agregar al carrito, no existe.');
            }

            const productIndex = cart.products.findIndex(p => p.productId === productId);
            if (productIndex === -1) {
                cart.products.push({ productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }

            return await cart.save();
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error.message);
            throw error;
        }
    }

    //  update the quantity of a product in a cart
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) return null;
    
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex === -1) return null;
    
        cart.products[productIndex].quantity = quantity;
        return await cart.save();
    }

    //  update a cart with an array of products
    async updateCart(cartId, products) {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) return null;
    
        cart.products = products.map(p => ({
            productId: p.productId,
            quantity: p.quantity
        }));
        return await cart.save();
    }

    //  delete a product from a cart
    async deleteProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) return null;
    
        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        return await cart.save();
    }

    //  delete a cart
    async deleteCart(cartId) {
        return await Cart.findByIdAndDelete(cartId).exec();
    }
}