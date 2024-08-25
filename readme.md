## Entrega Final
Simulación de tienda Informática.
La aplicación permite visualizar, agregar y eliminar productos.
Las Tecnologías utilizadas son:
- Node.js: Para la ejecución en el servidor.
- Express.js: Framework para Node.js.
- Handlebars: Para la visualización dinámica de plantillas.
- Socket.IO: Para la comunicación entre cliente y servidor.
- File System: Para almacenar y gestionar productos en JSON.

## Funcionalidades
- Guia de utilización: En la ruta https://localhost:8080 podrás ver una inicialización al proyecto con los enlaces a las ruta Products y Realtime Proucts.
- Visualización de Productos: Muestra una lista de productos ruta https://localhost:8080/products
- Agregado de Productos: Permite agregar nuevos productos desde un formulario en la vista realtimeproducts (https://localhost:8080/realtimeproducts).
- Eliminación de Productos: Los productos pueden ser eliminados desde la vista realtimeproducts.
- Actualización en Tiempo Real: Las adiciones y eliminaciones de productos se reflejan automáticamente en todos los clientes conectados.

## Instalación
1. Clonar el repositorio: mediante git clone 
2. Abre una terminal en el directorio del proyecto
3. Instalar dependencias: npm install
4. Iniciar el servidor: npm run dev
5. Abrir el navegador y navegar a http://localhost:8080
