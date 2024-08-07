import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./controllers/product-manager.js";
import path from 'path';


const app = express();
const PUERTO = 8000;
const manager = new ProductManager("./src/data/productos.json");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use(express.json());
app.use(express.static("./src/public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log("Escuchando en el puerto 8000");
})

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    socket.emit("productos", await manager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await manager.borrarProducto(id);

        const productosRestantes = await manager.getProducts();
        io.sockets.emit("productos", productosRestantes);

        if (productosRestantes.length === 0) {
            socket.emit("noProductos", true);
        }
    });
    socket.on("agregarProducto", async (nuevoProducto) => {
        try {
            await manager.addProduct(nuevoProducto);
            io.sockets.emit("productos", await manager.getProducts());
        } catch (error) {
            console.log("Error al agregar el producto:", error);
        }
    });

    socket.on("recargarProductos", async () => {
        const stockPath = path.join("./src/data/stock.json");
        await manager.cargarProductosDesdeStock(stockPath);
        io.sockets.emit("productos", await manager.getProducts());
    });
});