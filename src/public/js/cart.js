document.addEventListener('DOMContentLoaded', () => {
    const deleteFromCartButtons = document.querySelectorAll('.delete-from-cart-button');

    deleteFromCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.pid;

            try {
                // Obtener cartId del usuario actual
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

                // Confirmación antes de eliminar el producto
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

                //  solicitud para eliminar el producto del carrito
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Error while attempting to delete the product from the cart');
                }

                const result = await response.json();
                
                if (result.result === 'success') {
                    event.target.closest('li').remove();

                    Swal.fire({
                        title: 'Producto borrado!',
                        text: 'El producto fue borrado con exito',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error(result.message || 'The product couldn´t be deleted');
                }
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
