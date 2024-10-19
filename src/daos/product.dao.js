import productModel from "../models/product.model.js";
import mongoose from "mongoose";

export default class ProductDAO {
    async getProducts(query) {
        const { limit, page, sort, category, status } = query;
        const filter = {};
        if (category) filter.category = category;
        if (status !== undefined) filter.status = status === "true";
        
        const options = {
            limit : parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: sort ? { price: sort == "asc" ? 1 : -1 } : {},
            lean: true,
        };

        return await productModel.paginate(filter, options);
    }

    async createProduct(productData) {
        return await productModel.create(productData);
    }

    async updateProduct(productId, product) {
        return await productModel.updateOne({ _id: productId }, product );
    }

    async deleteProduct(productId) {
        return await productModel.deleteOne({_id: productId});
    }

    async getProductById(productId) {
        return await productModel.findOne({ _id: productId});
    }
}