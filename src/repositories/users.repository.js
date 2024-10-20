import UserDAO from "../daos/user.dao.js";
import UserDTO from "../dtos/user.dto.js";

export default class UserRepository {
    constructor() {
        this.userDAO = new UserDAO();
    }

    async getAllUsers() {
        try {
            const users = await this.userDAO.getAllUsers();
            return users.map(user => new UserDTO(user));
        } catch (error) {
            throw new Error("Error al mostrar todos los usuarios " + error.message);  
        }
    }

    async getUserById(uid) {
        try {
            const user = await this.userDAO.getUserById(uid);
            if (!user) {
                throw new Error("Usuario no encontrado");                
            }
            return new UserDTO(user);
        } catch (error) {
            throw new Error("Error en UsersRepository " + error.message);
        }        
    }

    async updateUserById(uid, updatedFields) {
        try {
            return await this.userDAO.updateUserById(uid, updatedFields);
        } catch (error) {
            throw new Error("Error en UsersRepository " + error.message);            
        }
    }

    async deleteUserById(uid){
        try {
            return await this.userDAO.deleteUserById(uid);
        } catch (error) {
            throw new Error("Error en UsersRepository " + error.message );
        }
    }
}