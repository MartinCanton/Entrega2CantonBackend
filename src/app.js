import express from "express";
import mongoose from 'mongoose'
import MongoStore from "connect-mongo";
import db from './dao/config/database.js';
import handlebars from 'express-handlebars';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import passport from "passport";
import initializePassport from './dao/config/passport.config.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import __dirname from './utils/utils.js'
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import productModel from '../src/dao/models/product.model.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())


//Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')


//Routes
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

//http server
const httpServer = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}`));

//websocket
const socketServer = new Server(httpServer, {
});

socketServer.on('connection', socket => {
    console.log('Nuevo Cliente Conectado');

    socket.on('addProduct', async (productData) => {
        try {
            if (!productData.thumbnails) {
                productData.thumbnails = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtDExrwaB9Stm_zfRr3TXXpp5njpBzpxeckw&s.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";
            }

            

            const socketAdded = await productModel.create(productData);
            if (socketAdded) {
                console.log('Producto nuevo agregado:', productData);

                
                const updatedProductList = await productModel.find({});
                socketServer.emit('productListUpdated', updatedProductList);

            }
        } catch (error) {
            console.error('Error al agregar un producto:', error)
        }
    });

    
    socket.on('deleteProduct', async (productId) => {
        try {
            console.log('Intentando eliminar producto con ID:', productId);
            const successfullyDeleted = await productModel.deleteOne({ _id: productId });
            if (successfullyDeleted.deletedCount > 0) {
                socketServer.emit('productDeleted', productId);
            }
        } catch (error) {
            console.error('Error al eliminar un producto:', error)
        }
    });
})
