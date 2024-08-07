const socket = io();

socket.on("productos", (data) => {

    renderProductos(data);
})

socket.on("noProductos", () => {
    document.getElementById("recargarProductos").style.display = "block";
});

document.getElementById("recargarProductos").addEventListener("click", () => {
    socket.emit("recargarProductos");
    document.getElementById("recargarProductos").style.display = "none";
});


const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.classList.add("productosContenedor");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cardProducto");
        card.innerHTML = `
                        <div class="cardContent">                            
                            <p class="cardTitle">${item.title}</p>
                            <img src="${item.img}" alt="${item.title}" class="cardImg">
                            <p class="cardDescription">Descripción: <br>${item.description}</p>
                             <div class="cardFooter">
                                <p class="cardStock">Stock: ${item.stock}</p>
                                <p class="cardCategory">Categoría: ${item.category}</p>
                            </div>
                            <p class="cardPrice">Precio: ${item.price}</p>
                        </div>
                        <button class="cardButton"> Eliminar </button>
                        `

        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        })
    })
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}


document.getElementById("agregarProductoForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const nuevoProducto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    };

    socket.emit("agregarProducto", nuevoProducto);

    document.getElementById("agregarProductoForm").reset();
});

socket.on("productos", (data) => {
    renderProductos(data);
});
