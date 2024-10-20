import CartDAO from "../daos/cart.dao.js";
import CartDTO from "../dtos/cart.dto.js";
import ProductDAO from "../daos/product.dao.js";

export default class CartsRepository {
    constructor() {
        this.cartDAO = new CartDAO();
        this.productDAO = new ProductDAO();
    }

    async createCart() {
        return await this.cartDAO.createCart();        
    }

    async getCartById(cid) {
        return await this.cartDAO.getCartById(cid);        
    }

    async addProductToCart(cid, pid, quantity ) {
        const product = await this.productDAO.findProductById(pid);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return await this.cartDAO.addProductToCart(cid, pid, quantity);
    }
    
    async updateProductQuantity(cid, pid, quantity) {
        const cart = await this.cartDAO.getCartById(cid);
        if(!cart) {
            throw new Error("Carrito no encontrado");            
        }
        const productInCart = cart.products.find(p => p.productId.toString() === pid);
        if (!productInCart) {
            throw new Error("Producto no encontrado en el carrito");            
        }
        return await this.cartDAO.updateProductQuantity(cid, pid, quantity);
    }

    async updateCart(cid, products) {
        const productsIds = products.map(product => product.productId);
        const existingProducts = await this.productDAO.findProductsByIds(productsIds);
        if (existingProducts.length !== productsIds.length){
            throw new Error("Uno o mas productos no fueron encontrados");            
        }
        const cartDTO = new CartDTO({ products });
        return await this.cartDAO.updateCart(cid, cartDTO.products);
    }

    async deleteProductFromCart(cid, pid) {
        return await this.cartDAO.deleteProductFromCart(cid, pid);        
    }

    async emptyCart(cid) {
        return await this.cartDAO.emptyCart(cid);        
    }

    async isValidCartId(cid) {
        return this.cartDAO.isValidCartId(id);        
    }

    async isValidProductId(pid) {
        return this.productDAO.isValidProductId(id);
    }
}
