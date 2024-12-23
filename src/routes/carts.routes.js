import { Router } from "express";
import CartService from '../services/cart.service.js';

const router = Router();
const cartService = new CartService();

//  get cart by id
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getCartById(cartId);
        return cart
            ? res.json(cart)
            : res.status(404).json({ error: 'Carrito no encontrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//  create a new cart
router.post('/', async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//  add product to cart
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartService.addProductToCart(cid, pid);
        return updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: 'Carrito no encontrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//  update a cart with an array of products
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;
        const updatedCart = await cartService.updateCart(cid, products);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar carrito:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//  update the quantity of a product in a cart
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar cantidad del producto:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//  delete a cart by id
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartService.deleteCart(cid);
        if (!result) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar carrito:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//  delete a product from a cart
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartService.deleteProductFromCart(cid, pid);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

export default router;
