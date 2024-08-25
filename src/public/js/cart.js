document.addEventListener('DOMContentLoaded', () => {
    const deleteFromCartButtons = document.querySelectorAll('.delete-from-cart-button');

    deleteFromCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.pid;
            const cartId = '66affd4bc723a31ad3519e85'; 
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();
                console.log(result)

                if (result.result === 'success') {
                    event.target.closest('li').remove();

                    Swal.fire({
                        title: 'Producto eliminado!',
                        text: 'El producto ha sido eliminado del carrito.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error(result.message);
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
