import { productService } from "../repositories/index.js";
import mongoose from "mongoose";

export default class ProductsController {
    async getProducts(req, res) {
        try {
            const result = await productService.getProducts(req.query);
            res.send({ result: "success", payload: result});
        } catch (error) {
            console.error("Error mientras se mostraba la lista de productos", error);
            res.status(500).json({ error: "Error mientras se mostraba la lista de productos"});
        }        
    }

    async createProduct(req, res) {
        try {
            const result = await productService.createProduct(req.body);
            res.send({ result: "success", payload: result});
        } catch (error) {
            console.error("Error mientras se creaba un nuevo producto", error);
            res.status(500).json({ error: "Error mientras se creaba un nuevo producto"});
        }        
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: "ID del producto invalida"});
            }
            const result = await productService.updateProduct(productId, req.body);
            res.send({ result: "success", payload: result});
        } catch (error) {
            console.error("Error mientras se actualizaba un producto", error);
            res.status(500).json({error: "Error mientras se actualizaba un producto"});
            
        }        
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: "ID del producto invalida"});
            }
            await productService.deleteProduct(productId);
            res.send({ result: "success", payload: {message: "Producto eliminado"}}) 
        } catch (error) {
            console.error("Error mientras se eliminaba el producto", error);
            res.status(500).json({error: "Error mientras se eliminaba un producto"});
            
        }
    }

    async getProductsById(req, res) {
        try {
            const productId = req.params.pid;
            if (!mongoose.Types.ObjectId.isValid(productId)){
                return res.status(400).json({ error: "ID del producto invalida"});
            }
            const result = await productService.getProductsById(productId);
            if (!result) {
                return res.status(404).json({ error: "Producto no encontrado"});
            }
            res.send({result: "success", payload: result});
        } catch (error) {
            console.error("Error mientras mostrabamos el producto", error);
            res.status(500).json({ error: "Error mientras mostrabamos el producto"});   
        }        
    }
}