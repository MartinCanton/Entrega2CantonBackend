
document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const productId = event.target.dataset.pid;
        
        try {
          const currentUserResponse = await fetch('/api/sessions/current', {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include'
            });
  
          if (!currentUserResponse.ok) {
              throw new Error('Error al obtener la sesión del usuario.');
          }
          
          const { cartId, user } = await currentUserResponse.json();
          console.log('Usuario actual:', user);
          console.log('ID carrito:', cartId);

          if(!cartId) {
            throw new Error('No se puede obtener el id del carrito');
          }

          const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
              bodyParser: JSON.stringify({})
          });

          
          const result = await response.json();
          
          if (result.result === 'success'){
            Swal.fire({
              title: "Producto agregado!",
              text: `El producto ha sido agregado al carrito.`,
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            throw new Error(result.message || 'No pudimos agregar el producto');
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      });
    });
  
    //filtros
  
    const form = document.getElementById('filter-form');
  
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
  
        const category = document.getElementById('category-select').value;
        const status = document.getElementById('status-select').value;
        const sort = document.getElementById('sort-select').value;
        const limit = document.getElementById('limit-select').value;
  
    
        let queryString = '?';
        if (category) queryString += `category=${category}&`;
        if (status) queryString += `status=${status}&`;
        if (sort) queryString += `sort=${sort}&`;
        if (limit) queryString += `limit=${limit}&`;
  
  
        queryString = queryString.slice(0, -1);
  
  
        window.location.href = `/products${queryString}`;
    });
  });
  