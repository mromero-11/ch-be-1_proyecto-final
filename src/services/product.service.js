import Product from "./models/product.js";

export default class ProductService {

    // Validate product fields
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

    /* API Methods */

    // Get all products
    async getAllProducts(limit) {
        const query = Product.find();
        if (limit) query.limit(limit);
        return await query.exec();
    }

    // Get product by id
    async getProductById(id) {
        return await Product.findById(id).exec();
    }

    // Add product
    async addProduct(product) {
        this.validateProduct(product);
        const newProduct = new Product(product);
        return await newProduct.save();
    }

    // Update product
    async updateProduct(id, updatedFields) {
        const product = await Product.findById(id);
        if (!product) return null;

        Object.assign(product, updatedFields);
        this.validateProduct(product);

        return await product.save();
    }

    // Delete product
    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id).exec();
    }
}
