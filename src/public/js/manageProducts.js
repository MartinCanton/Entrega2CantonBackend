document.addEventListener('DOMContentLoaded', () => {
  
    Swal.fire({
      title: "Te damos la bienvenida",
      text: "Este es el manejador de productos. Usa el formulario para agregar nuevos productos al catálogo. Si quieres remover un producto, haz click en el botón de 'Eliminar'",
    });
  
    const addProductForm = document.getElementById("add-product-form");
  
    addProductForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const formData = new FormData(addProductForm);
      const title = formData.get("title");
      const description = formData.get("description");
      const price = formData.get("price");
      const thumbnails = formData.get("thumbnails") || 
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtDExrwaB9Stm_zfRr3TXXpp5njpBzpxeckw&s.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";
      const code = formData.get("code");
      const stock = formData.get("stock");
      const category = formData.get("category");
      const status = formData.get("status");
  
      if (!title || !description || !price || !code || !stock || !category || !status) {
          Swal.fire({
              title: "Error",
              text: "Todos los campos son obligatorios excepto thumbnails",
          });
          return;
      }
  
      const productData = { title, description, price, thumbnails, code, stock, category, status, };
      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),  
        });
        if (!response.ok) {
          throw new Error("Error al crear el producto");
        }

        const result = await response.json();
        Swal.fire({
          title: "¡Producto enviado!",
          text: `El producto ${productData.title} ha sido enviado.`,
        });

        renderProductList(result.updatedProductList);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Ocurrió un error: ${error.message}`,
        });
      }
    });

    const renderProductList = (products) => {
      const productList = document.getElementById("rt-product-list");
      productList.innerHTML = "";
      products.forEach((product) => {
        const newProductItem = document.createElement("li");
        newProductItem.setAttribute("data-id", `${product._id}`);
        newProductItem.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.thumbnails}">
        <p>${product.description}</p>
        <p>$${product.price}</p>
        <button class="btn btn-danger delete-product" data-id="${product._id}">Eliminar de catálogo</button>
      `;
      productList.appendChild(newProductItem);
      });
    };

    document.addEventListener("click", async (event) => {
      if (event.target && event.target.classList.contains("delete-product")) {
        const productId = event.target.getAttribute("data-id");
        try {
          const response = await fetch(`/api/products/${productId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Error al eliminar el producto");
          }
          
          const productItem = document.querySelector(
            `li[data-id='${productId}']`
          );
          if (productItem) {
            productItem.remove();
          }
          Swal.fire ({
            title: "¡Producto eliminado con éxito!",
            text: `El producto id ${productId} ha sido eliminado del catálogo.`, 
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: `Ocurrió un error al eliminar el producto: ${error.message}`,  
          });          
        }
      }      
    });
  });

  
   
  