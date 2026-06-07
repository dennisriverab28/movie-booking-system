//  Restrict access to only 'admin'
const username = localStorage.getItem('loggedInUser');
if (username !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = 'index.html';
}

// 🔐 Restrict access to admin only
const username = localStorage.getItem('loggedInUser');
if (username !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = 'index.html';
}

//  Handle Add Movie form submission
document.getElementById('add-movie-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('movie-title').value;
    const description = document.getElementById('movie-description').value;
    const imageUrl = document.getElementById('movie-image').value;

    if (!title || !description || !imageUrl) {
        alert('Please fill in all movie fields.');
        return;
    }

    const newMovie = {
        title: title,
        description: description,
        imageUrl: imageUrl
    };

    // Send movie data to backend
    fetch('http://localhost:8080/api/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie)
    })
    .then(response => {
        if (response.ok) {
            alert('Movie added successfully!');
            window.location.reload();
        } else {
            alert('Failed to add movie.');
        }
    })
    .catch(error => {
        console.error('Error adding movie:', error);
        alert('An error occurred.');
    });
});
