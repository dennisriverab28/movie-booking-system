//  LOGIN FORM HANDLER
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                localStorage.setItem('loggedInUser', data.username); // ✅ Save to localStorage
                alert('Login successful! 🎉');
                window.location.href = "index.html"; // Redirect to homepage
            });
        } else {
            alert('Invalid login. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    });
});

//  SIGNUP FORM 
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('new-username').value;
    const email = document.getElementById('email').value; // not used yet
    const password = document.getElementById('new-password').value;

    fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Account created! 🎉 You can now login.');
            window.location.href = "login.html";
        } else {
            alert('Signup failed. Try again.');
        }
    })
    .catch(error => {
        console.error('Error during signup:', error);
        alert('An error occurred during signup.');
    });
});
