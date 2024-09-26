const form = document.getElementById('register-form');
const errorMessageDiv = document.getElementById('error-message-reg');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name, last_name, email, age, password })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = '/profile';  
        } else {
            errorMessageDiv.innerText = result.errorMessage || 'Error while attemting to register';
        }
    } catch (error) {
        console.error('Error in the request:', error);
        errorMessageDiv.innerText = 'An error has ocurred when proccessing the request ';
    }
});

