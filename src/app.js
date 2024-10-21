import express from "express";
import MongoStore from 'connect-mongo';
import db from './config/database.js';
import handlebars from 'express-handlebars'
import sessionsRouter from './routes/sessions.router.js'
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/users.router.js';
import __dirname from './utils/utils.js'
import viewsRouter from './routes/views.router.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'

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

