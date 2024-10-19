import userModel from "../models/user.model.js";

export default class userDAO {
    async getAllUsers() {
        try {
            return await userModel.find();
        } catch (error) {
            throw new Error("Error mostrando los usuarios" + error.message);
        }
    }

    async getUserById(uid) {
        try {
            return await userModel.findOne({_id: uid})
        } catch (error) {
            throw new Error("Error mostrando el usuario" + error.message);
        }
    }

    async updateUserById(uid, updatedFields) {
        try {
            return await userModel.updateOne({ _id: uid }, updatedFields);
        } catch (error) {
            throw new Error("Error actualizando el usuario"+ error.message);            
        }
    }

    async deleteUserById(uid) {
        try {
            return await userModel.deleteOne({ _id: uid });
        } catch (error) {
            throw new Error("Error al borrar usuario "+ error.message);            
        }
    }
}