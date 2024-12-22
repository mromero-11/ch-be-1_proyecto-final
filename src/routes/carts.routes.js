import { Router } from "express";
import CartManager from '../services/CartManager.js';

const router = Router();
const cartManager = new CartManager();

//  get cart by id
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
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
        const newCart = await cartManager.createCart();
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
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        return updatedCart
            ? res.json(updatedCart)
            : res.status(404).json({ error: 'Carrito no encontrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

export default router;
