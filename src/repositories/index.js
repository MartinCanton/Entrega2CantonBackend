import CartsRepository from "./carts.repository.js";
import ProductsRepository from "./products.repository.js";
import UserRepository from "./users.repository.js";
import SessionsRepository from "./sessions.repository.js";
import TicketsRepository from "./tickets.repository.js";


const cartService = new CartsRepository();
const productService = new ProductsRepository();
const userService = new UserRepository();
const sessionService = new SessionsRepository();
const ticketsService = new TicketsRepository();




export {cartService, productService, userService, sessionService, ticketsService};