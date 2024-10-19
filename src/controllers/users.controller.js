import { userService } from "../repositories/index.js"

export default class UsersController {
    async getAllUsers (req, res) {
        try {
            const users = await userService.getAllUsers();
            res.send({ result: "success", payload: users });
        } catch (error) {
            res.status(500).send({ status: "error", error: "Error interno del servidor"});
        }        
    }

    async getUserById (req, res) {
        try {
            const uid = req.params.uid;
            const user = await userService.getUserById(uid);
            res.send({ result: "success", payload: user });
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message });
        }        
    }

    async updateUserById (req,res) {
        try {
            const uid = req.params.uid;
            const allowedFields = ["first_name", "last_name", "age"];
            const updatedFields = {};
            for  (const key in req.body){
                if (allowedFields.includes(key)) {
                    updatedFields[key] = req.body[key];
                } else {
                    return res.status(400).json({ error: `El campo "${key}" no corresponde a una actualizacion de usuario`});
                }
            }
            const result = await userService.updateUserById(uid, updatedFields);
            res.send({ result: "success", payload: result });
        } catch (error) {
            res.status(500).send({ result: "error", payload: error.message});
        }
    }

    async deleteUserById (req, res) {
        try {
            const uid = req.params.uid;
            await userService.deleteUserById(uid);
            res.send({ result: "success", message: "Usuario eliminado exitosamente"});
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message});
        }
    }
}