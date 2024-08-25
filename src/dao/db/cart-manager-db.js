import CartModel from "../models/cart.model.js";

class CartManager {

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({products: []});
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch(error){
            console.log("Error al crear un nuevo carrito");
        }
    }


    async getCarritoById(carritoId) {
        try {
            const carritoBuscado = await CartModel.findById(carritoId);

            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese id");
            }

            return carritoBuscado;

        } catch (error) {
            console.log("Error al obtener el carrito por id");
            throw error;
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const existeProducto = carrito.products.find(p => p.productt.toString() === productoId); 

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productoId, quantity });
        }

        carrito.markModified("products");
        await carrito.save();
        return carrito;
    } catch(error) {
        console.log("Error al agregar un producto al carrito;", error);
    }
}


}

export default CartManager;