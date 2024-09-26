import { response } from "express";

document.addEventListener('DOMContentLoaded', () => {
    const deleteFromCartButtons = document.querySelectorAll('.delete-from-cart-button');

    deleteFromCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.pid;

            try {
                const currentUserResponse = await fetch('/api/sessions/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!currentUserResponse.ok) {
                    throw new Error('Error al obtener la sesion del usuario.');
                }

                const { cartId } = await currentUserResponse.json();

                if (!cartId) {
                    throw new Error('No se puede obtener el id del carrito.');
                }
                const confirmDelete = await Swal.fire({
                    title: 'Estas seguro?',
                    text: 'Estas seguro de eliminar el producto.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
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
                    throw new Error('Error mientras se borraba el producto del carrito');
                }

                const result = await response.json();

                if (result.result === 'success') {
                    event.target.closest('li').remove();

                    Swal.fire({
                        title: 'Producto borrado.',
                        text: ' El producto fue borrado del carrito.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error(result.message || 'El producto no puede ser borrado.');
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
