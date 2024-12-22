import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const cartsFile = path.resolve('data', 'carts.json');

export default class CartManager {

    //  ctor
    constructor() {
        this.carts = [];
        this.loadFile()
    }

    //  db
    async loadFile() {
        try {
            const data = await fs.readFile(cartsFile, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo de carritos:', error.message);
            this.carts = [];
        }
    }

    async saveFile() {
        try {
            const jsonData = JSON.stringify(this.carts, null, 2);
            await fs.writeFile(cartsFile, jsonData);
        } catch (error) {
            console.error('Error al guardar el archivo de carritos:', error.message);
        }
    }

    /*  api methods  */

    //  create a new empty cart
    async createCart() {
        try {
            const newCart = {
                id: randomUUID(),
                products: [],
            };
            
            this.carts.push(newCart);
            
            await this.saveFile();

            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error.message);
            throw error;
        }
    }

    //  get cart by id
    async getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    //  add a product to the cart
    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.productId === productId);
            if (productIndex === -1) {
                cart.products.push({ productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }

            await this.saveFile();
            
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error.message);
            throw error;
        }
    }
}
