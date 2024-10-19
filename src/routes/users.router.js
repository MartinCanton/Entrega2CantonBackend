import { Router } from "express";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

const router = Router();

router.get('/', async (req, res) => {
    try {
        let users = await userModel.find();
        res.send({ result: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: 'Error', error: "Error interno del servidor"});
    }
});

router.get('/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return res.status(400).json({ error: "Error de ID. Ingrese uno valido."});
        }
        let result = await userModel.findOne({_id:uid});
        if (!result) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.send({ result: "success", payload: result });
    } catch (error){
        console.error("Error mostrando el usuario", error);
        res.status(500).json({ error: "Error al mostrar el producto"});
    }
});

router.put('/:uid', async (req, res) => {
    try {
        let uid = req.params.uid;

        let allowedFields = [
            "first_name",
            "last_name",
            "age",
        ];

        const updatedFields = {};

        for (const ket in req.body) {
            if (key !== "id" && allowedFields.includes(key)){
                updatedFields[key] = req.body[key];
            } else if (key !== "id") {
                return res.status(400).json({ error: `Campo '${key}' no se puede actualizar` });
            }
        }
        let user = await userModel.updateOne({_id:uid}, updatedFields)
        res.send({ result: "success", payload: user });
    } catch (error) {
        res.status(500).send({ result: "error", payload: error });
    }
});

router.delete('/:uid', async (req, res) => {
    try {
        let uid = req.params.uid;
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return res.status(400).json({ error: "ID del usuario invalido"});
        }
        let result = await userModel.deleteOne({_id:uid});
        if (result.deletedCount === 0){
            return res.status(404).json({ error: "Usuario no encontrado"});
        }
        res.send({ result: "success", payload: result});
    } catch (error){
        console.error("Error mientras se eliminaba el usuario", error);
        res.status(500).json({ error: "Error mientras borraba el usuario"});
    }
});

export default router;
