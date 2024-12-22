import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const productsFile = path.resolve('data', 'products.json');

export default class ProductManager {

    //  ctor
    constructor() {
        this.products = [];
        this.loadFile()
    }

    //  db
    async loadFile() {
        try {
            const data = await fs.readFile(productsFile, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error.message);
            this.products = [];
        }
    }

    async saveFile() {
        try {
            const jsonData = JSON.stringify(this.products, null, 2);
            await fs.writeFile(productsFile, jsonData);
        } catch (error) {
            console.error('Error al guardar el archivo de productos:', error.message);
        }
    }

    //  validation
    validateProduct(product) {
        const { code, title, description, category, price, stock } = product;

        if (!code || typeof code !== 'string' || code.trim() === '') {
            throw new Error('Código de producto no debe estar vacío.');
        }

        if (!title || typeof title !== 'string' || title.trim() === '') {
            throw new Error('Título del producto no debe estar vacío.');
        }

        if (!description || typeof description !== 'string' || description.trim() === '') {
            throw new Error('Descripción del producto no debe estar vacía.');
        }

        if (!category || typeof category !== 'string' || category.trim() === '') {
            throw new Error('Categoría del producto no debe estar vacía.');
        }

        if (typeof price !== 'number' || price <= 0) {
            throw new Error('Precio del producto debe ser un número positivo.');
        }

        if (typeof stock !== 'number' || stock < 0) {
            throw new Error('Stock del producto debe ser un número no negativo.');
        }
    }

    /*  api methods  */

    //  get all products
    async getAllProducts(limit) {
        return limit ? this.products.slice(0, limit) : this.products;
    }

    //  get product by id
    async getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    //  add product
    async addProduct(product) {
        try {
            this.validateProduct(product);

            const newProduct = {
                id: randomUUID(),
                ...product,
                status: true,
            };

            this.products.push(newProduct);

            await this.saveFile();

            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
            throw error;
        }
    }
    
    //  update product
    async updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;
        
        try {
            this.validateProduct({ ...this.products[productIndex], ...updatedFields });

            const updatedProduct = {
                ...this.products[productIndex],
                ...updatedFields,
                id: this.products[productIndex].id,
            };

            this.products[productIndex] = updatedProduct;

            await this.saveFile();

            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            throw error;
        }
    }

    //  delete product
    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;
        
        try {
            const deletedProduct = this.products.splice(productIndex, 1);

            await this.saveFile()

            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            throw error;
        }
    }
}
