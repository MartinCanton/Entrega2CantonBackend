import { cartService } from "../repositories/index.js";

export default class CartsController {
    async creatCart(req, res) {
        try {
            const result = await cartService.creatCart();
            res.send({ result: "succes", payload: result });
        } catch (error) {
            res.status(500).send({ result: "error", payload: error});
        }        
    }

    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            if (!(await cartService.IsValidCartId(cid))) {
                return res.status(400).send({ result:"error", message: "ID del carrito inválido"});
            }
            const cart = await cartService.getCartById(cid);
            if (!cart){
                return res.status(404).json({ error: "Carrito no encontrado"});
            }
            res.send({ result: "succes", payload: cart});
        } catch (error) {
            res.status(500).send({ result: "error", payload: error});
        }    
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            if (!(await cartService.IsValidCartId(cid)) || !(await cartService.IsValidProductId(pid))){
                return res.status(400).send({ result: "error", message: "ID invalida"});
            }
            const updatedCart = await cartService.addProductToCart(cid, pid, quantity || 1);
            res. status(200).json({ message: "Producto añadido", cart: updatedCart});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            if(!(await cartService.IsValidCartId(cid)) || !(await cartService.IsValidProductId(pid))){
                return res.status(400).send({ result: "error", message: "ID invalida"});
            }
            const result = await cartService.updateProductQuantity(cid, pid, quantity);
            res.send({ result: "success", payload: result});
        } catch (error) {
            res.status(500).send({ result: "error", payload: error});
        }
    }

    async updatedCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            if (!products || !Array.isArray(products)) {
                return res.status(400).send({ result: "error", message: "Los productos son requeridos y deben ser un array"});
            }
            const result = await cartService.updatedCart(cid, products);
            res.send({ result: "success", payload: result});
        } catch (error) {
            res.send(500).send({ result: "error", payload: error.message});
        }
    }

    async deleteProductsFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            if (!(await cartService.IsValidCartId(cid)) || !(await cartService.IsValidProductId(pid))) {
                return res.status(400).send({ result: "error", message: "ID invalida"});
            }
            const result = await cartService.deleteProductsFromCart(cid, pid);
            res.send({ result: "success", payload: result});
        } catch (error) {
            res.stats(500).send({ result: "error", payload: error});
        }        
    }

    async emptyCart(req, res) {
        const { cid } = req.params;
        try {
            if (!(await cartService.IsValidCartId(cid))) {
                return res.status(400).send({ result: "error", message: "ID del carrito invalido"});
            }
            const result = await cartService.emptyCart(cid);
            res.send({ result: "success", payload: result });
        } catch (error) {
            res.stats(500).send({ result:"error", payload: error});
        }        
    }

    async completePurchase(req, res) {
        try {
            const { cid } = req.params;
            const { email } = req.user;
            const result = await cartService.completePurchase(cid, email);
            if (!result.success) {
                return res.status(400).json({ result: "error", message: result.message, productsNotPurchased: result.productsNotPurchased, });
            }
            res.status(200).json({ result: "success", message: "Compra completada", productsNotPurchased: result.productsNotPurchased, });
        } catch (error) {
            res.status(500).json({ result: "error", message: "Error mientras se procesaba la compra", error: error.message});
        }        
    }
}