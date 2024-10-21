import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/utils.js";
import dotenv from "dotenv";
import CartDAO from "../daos/cart.dao.js";
import UserDAO from "../daos/user.dao.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export default class SessionsRepository {
    constructor() {
        this.userDAO = new UserDAO();
        this.cartDAO = new CartDAO();
    }

    async register({ first_name, last_name, email, age, password, role }) {
        const userExists = await this.userDAO.getUserByEmail(email);
        if (userExists){
            throw new Error("El usuario ya existe, inicia sesión");            
        }
        const newCart = await this.cartDAO.createCart();
        const newUser = { first_name, last_name, email, age, password: createHash(password), cart: newCart._id, role };
        const savedUser = await this.userDAO.createUser(newUser);
        const token = jwt.sign (
            {id: savedUser._id, role: savedUser.role},
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        return token;
    }

    async login({ email, password}) {
        const user = await this.userDAO.getUserByEmail(email);
        if(!user || !isValidPassword(user, password)) {
            throw new Error("Las credenciales son errones");            
        }
        const token = jwt.sign(
            { id: user._id, role: user.role},
            JWT_SECRET,
            {expiresIn: "1h"});
        return token;        
    }

    async logout() {
        return true;
    }
}
