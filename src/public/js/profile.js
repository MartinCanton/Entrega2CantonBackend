const button = document.getElementById('logout-btn');
button.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            window.location.href= '/login';
        } else {
            console.error('Error al desloguearte');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
})