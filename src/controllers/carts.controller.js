import { cartService } from "../repositories/index.js";

export default class CartsController {
    async createCart(req, res) {
        try {
            const cart = await cartService.createCart();
            res.status(201).json({ result: "success", message: "Carrito creado exitosamente", payload: cart });
        } catch (error) {
            res.status(500).json({ result: "error", message: "Error creando el carrito", error: error.message});
        }
    }

    async getCartById(req, res) {
        try {
            const cid  = req.params.cid || req.user.cart;
            if (!cid) {
                return res.status(400).json({ result: "error", message: "El ID del carrito es necesario." });
            }
            const cart = await cartService.getCartById(cid);
            res.status(200).json({ result: "success", message: "Carrito recibido exitosamente", payload: cart});
        } catch (error) {
            res.status(404).json({ result: "error", message: "Error, el carrito no existe", error: error.message});
        }    
    }

    async addProductToCart(req, res) {
        try {
            const {cid, pid } = req.params;
            let { quantity } = req.body;
            if (!cid || !pid) {
                return res.status(400).json({ result: "error", message: "El ID del carrito y el producto son requeridos"});
            }
            quantity = quantity !== undefined && !isNaN(parseInt(quantity)) && parseInt(quantity) > 0 ? parseInt(quantity) : 1;

            const cart = await cartService.addProductToCart(cid, pid, quantity);
            res.status(200).json({ result: "success", message: "El producto fue añadido exitosamente", payload: cart});
        } catch (error) { 
            res.status(500).json({ result: "error", message: "El producto no puede ser añadido al carrito", error: error.message});
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await cartService.updateProductQuantity(cid, pid, quantity);
            res.status(200).json({ result: "success", message: "La cantidad de productos fue actualizada", payload: cart});
        } catch (error) {
            res.status(500).json({ result: "error", message: "La cantidad de productos no pudo ser actualizada", error: error.message});
        }
    }

    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            const cart = await cartService.updateCart(cid, products);
            res.status(200).json({ result: "success", message: "El carrito fue actualizado", payload: cart});
        } catch (error) {
            res.status(500).json({ result: "error", message:"El carrito no pudo ser actualizado", error: error.message});
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const cart = await cartService.deleteProductFromCart(cid, pid);
            res.status(200).json({ result: "success", message:"El producto fue eliminado exitosamente", payload: cart});
        } catch (error) { 
            res.status(500).json({ result: "error", message: "El producto no pudo ser eliminado", error: error.message});            
        }        
    }

    async emptyCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.emptyCart(cid);
            res.status(200).json({ result: "success", message: "El carrito ha sido vaciado", payload: cart});
        } catch (error) {
            res.status(500).json({ result: "error", message:"El carrito no puede ser vaciado", error: error.message});            
        }        
    }

    async completePurchase(req, res) {
        try {
          const { cid } = req.params;
          const { email } = req.user; 
    
          const result = await cartService.completePurchase(cid, email);
    
          if (!result.success) {
            return res.status(400).json({
              result: "error",
              message: result.message,
              productsNotPurchased: result.productsNotPurchased,
            });
          }
    
          res.status(200).json({
            result: "success",
            message: "Purchase completed",
            productsNotPurchased: result.productsNotPurchased,
          });
        } catch (error) {
          res.status(500).json({
            result: "error",
            message: "Error while proccessing the purchase",
            error: error.message,
          });
        }
      }
}