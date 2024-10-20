import CartsRepository from "./carts.repository.js";
import ProductsRepository from "./products.repository.js";


const cartService = new CartsRepository();
const productService = new ProductsRepository();


export {cartService, productService};