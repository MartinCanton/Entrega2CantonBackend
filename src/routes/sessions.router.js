import { Router } from "express";
import jwt from 'jsonwebtoken';
import { createHash, isValidPassword, passportCall } from "../utils/utils";
import userModel from "../dao/models/user.model";
import cartModel from "../dao/models/cart.model";
import { authorization } from "../middlewares/auth";
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ errorMessage: 'Este usuario ya existe'});    
        }

        const NweCart = await cartModel.create({ products: [] });

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: NweCart._id
        });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role},
            JWT_SECRET,
            { expiresIn: "24hs" }
        );

        res.cookie("jwt", token, { httpOnly: true, secure: false });
        res.status(200).json({ message: "Registro exitoso" });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor"});
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user || !isValidPassword(user, password )){
            return res.status(401).json({ errorMessage: "Las credenciales son erroneas."});
        }

        let token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "24hs"
        });

        res.cookie("jwt", token, { httpOnly: true, secure: false });
        res.status(200).json({ message: "Login exitoso" });
    } catch (error){
        res.status(500).json({ errorMessage: "Error interno del servidor"});
    }
});

router.post('/logout', (req, res) => {
    try{
        res.clearCookie('jwt', { httpOnly: true, secure: false});
        res.status(200).json({ message: "Deslogueo exitoso."});
    } catch (error) {
        res.status(500).json({ errorMessage: "Error en el deslogueo."});
    }
});

router.get('/current', passportCall('jwt'), authorization('user'), (req, res) => {
    try {
        const user = req.user;
        const cartId = user.cart;
        res.json({ user, cartId });
    } catch (error) {
        res.status(500).json({ message: "Error mostrando el usuario."});
    }
});

export default router;
