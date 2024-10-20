import CartsRepository from "./carts.repository.js";
import ProductsRepository from "./products.repository.js";
import UsersRepository from "./users.repository.js";
import SessionsRepository from "./sessions.repository.js";
import TicketsRepository from "./tickets.repository.js";


const cartService = new CartsRepository();
const productService = new ProductsRepository();
const userService = new UsersRepository();
const sessionService = new SessionsRepository();
const ticketService = new TicketsRepository();




export {cartService, productService, userService, sessionService, ticketService};