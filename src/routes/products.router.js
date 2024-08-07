import express from "express";
import ProductManager from "../controllers/product-manager.js";

const router = express.Router();
const manager = new ProductManager("./src/data/productos.json")

router.get("/products", async (req, res) => {

    let limit = req.query.limit;

    try {
        const arrayProductos = await manager.getProducts();
        if (limit) {
            res.send(arrayProductos.slice(0, limit));
        } else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor")
    }
});


router.get("/products/:pid", async (req, res) => {
    let id = req.params.pid;

    const producto = await manager.getProductById(parseInt(id));

    if (!producto) {
        res.send("No se puede encontrar el producto")
    } else {
        res.send({ producto });
    }
});

router.post("/products", async (req, res) => {
    const nuevoProducto = req.body;
    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).send({ message: "Producto agregado exitosamente !!" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message })
    }
});

router.put("/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid);
    const productoActualizable = req.body;

    try {
        const productoActualizado = await manager.actualizarProducto(id, productoActualizable);
        if (productoActualizado) {
            res.send({ message: "Producto actualizado exitosamente", producto: productoActualizado });
        } else {
            res.status(404).send("No se ha encontrado el producto");
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

router.delete("/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid);

    try {
        const resultado = await manager.borrarProducto(id);
        if (resultado) {
            res.send({ message: "Producto eliminado exitosamente" });
        } else {
            res.status(404).send("No se ha encontrado el producto");
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});


export default router;