# Proyecto Tienda Informatica
Simulación de tienda Informática.
Esta aplicación fue creada 
Las Tecnologías utilizadas son:
- Node.js: Para la ejecución en el servidor.
- Express.js: Framework para Node.js.
- Handlebars: Para la visualización dinámica de plantillas.
- Socket.IO: Para la comunicación entre cliente y servidor.
- Sweet Alert.
- MongoDB Atlas.
- Mongoose.
- Mongoose-paginate-v2.
- Bootsrap.
- Passport.js.
- Passport-jwt.
- Bcrypt.
- Jsonwebtoken.
- Cookie-parser.
- dotenv.
- Uuid.
- Nodemailer.



## Funcionalidades
- Endpoints API:

**Carts**
 - GET: 
    * Obtener un carrito por id: `https://localhost:8080/api/carts/:cid`

 - POST: 
    * Crear un carrito nuevo: `https://localhost:8080/api/carts` 
    * Agregar un producto al carrito por ID: `https:/localhost:8080/api/carts/:cid/products/:pid`

 - PUT: 
    * Actualizar la cantidad de un producto en particular: `https://localhost:8080/carts/:cid/products/:pid`

 - DELETE: 
    * Elimina un producto seleccionado del carrito: `https://localhost:8080/api/carts/:cid/products/:pid`
    * Vaciar el Carrito según el ID: `https://localhost:8080/api/carts/:cid`

**Products**
 - GET:
    * Obtener todos los productos: `https://localhost:8080/products`
    * Filtros : 
        - Pagina
        - Limit 
        - Orden
        - Categoria
        - Status
    * Obtener producto por id: `https://localhost:8080/api/products/:pid`

- POST:
    * Crear un producto: `https://localhost:8080/api/products`        

- PUT:
    * Actualizar producto por su ID: `https://localhost:8080/api/products/:pid`

- DELETE: 
    * Eliminar un producto por su ID: `https://localhost:8080/api/products/:pid`  

**Usuarios**
- GET:
    * Obtener todos los usuarios: `http://localhost:8080/api/users`
    * Obtener un usuario por id: `http://localhost:8080/api/users/:uid`

- PUT:
    * Actualizar Usuario por id: `http://localhost:8080/api/users/:uid`

- DELETE:
    * Eliminar un usuario por id: `http://localhost:8080/api/users/:uid`

**Sessions**

- POST:
    * LOGIN:
        `http://localhost:8080/api/sessions/login`
        Si el login es correcto, devuelve el token.

    * REGISTER:
        `http://localhost:8080/api/sessions/register`   
        Si el registro es correcto, devuelve el token. 

    * LOGOUT:
        `http://localhost:8080/api/sessions/logout`    


## Vistas

- Visualización de Productos: Muestra una lista de productos en la ruta `https://localhost:8080/products`
- Agregado de Productos: Permite agregar nuevos productos desde un formulario en la vista manageproducts. El usuario debe tener rol de admin. (`https://localhost:8080/manageproducts`).
- Filtros: Categoria - Disponibilidad - Orden - Limites
- Eliminación de Productos: Los productos pueden ser eliminados desde la vista realtimeproducts.
- Actualización en Tiempo Real: Las adiciones y eliminaciones de productos se reflejan automáticamente en todos los clientes conectados.
- Visualización de Cart: (`https://localhost:8080/cart`) (Tienes que estar logueado) Puedes ver los productos que se agregaron al carrito y puedes eliminarlos.
- Mi perfil: (`https://localhost:8080/profile`) (Tienes que estar Logueado) Se puede ver los datos de quien esta logueado (sin datos sensibles). Y se puede desloguear
- Login: (`https://localhost:8080/login`) Formulario para iniciar sesión
- Registro: (`https://localhost:8080/register`) Formulario para registrarse

### Instalación
1. Clonar el repositorio: mediante git clone 
2. Abre una terminal en el directorio del proyecto
3. Instalar dependencias: npm install
4. Crea un archivo .env en la raiz del proyecto, para agregar las variables de entorno.(.env.example)
5. Iniciar el servidor: npm run dev
6. Abrir el navegador y navegar a `http://localhost:8080/products`


