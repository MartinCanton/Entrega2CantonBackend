document.addEventListener('DOMContentLoaded', () => {
    const deleteFromCartButtons = document.querySelectorAll('.delete-from-cart-button');

    deleteFromCartButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.pid;

            try {                
                const currentUserResponse = await fetch('/api/sessions/current', {
                    method: 'GET',
                    headers: {
                      "Content-Type": "application/json"
                    },
                    credentials: 'include'  
                });

                if (!currentUserResponse.ok) {
                    throw new Error('Error al obtener la sesión del usuario.');
                }

                const { cartId } = await currentUserResponse.json();

                if (!cartId) {
                    throw new Error('No se pudo obtener el cartId');
                }

                const confirmDelete = await Swal.fire({
                    title: 'Estas seguro?',
                    text: 'Estas seguro que quieres borrar el producto?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: "Borrar !",
                    cancelButtonText: 'Cancelar'
                });

                if (!confirmDelete.isConfirmed) {
                    return; 
                }

                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Error mientras se eliminaba el producto del carrito');
                }
    
                event.target.closest('li').remove();

                Swal.fire({
                    title: 'Producto borrado!',
                    text: 'El producto fue borrado con exito',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    });
});
