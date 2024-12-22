import { Router } from "express";
import ProductManager from '../services/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

//  get all products
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined
        const products = await productManager.getAllProducts(limit)
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//  get product by id
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        return product 
            ? res.json(product) 
            : res.status(404).send('Producto no encontrado');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
})

//  add product
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
})

//  update product by id
router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        return updatedProduct 
            ? res.json(updatedProduct) 
            : res.status(404).send('Producto no encontrado');
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
})

//  delete product by id
router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await productManager.deleteProduct(productId);
        return deletedProduct 
            ? res.json(deletedProduct) 
            : res.status(404).send('Producto no encontrado');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
})

export default router;
