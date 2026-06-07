// Load movies from backend
function loadMovies() {
    fetch('http://localhost:8080/api/movies')
        .then(response => response.json())
        .then(movies => {
            const moviesDiv = document.getElementById('movie-list');
            moviesDiv.innerHTML = ''; // Clear old content

            movies.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');

                movieCard.innerHTML = `
                    <img src="${movie.imageUrl}" alt="${movie.title}" class="movie-poster">
                    <h3>${movie.title}</h3>
                    <p>${movie.description}</p>
                `;

                const bookNowButton = document.createElement('button');
                bookNowButton.textContent = 'Book Now';
                bookNowButton.classList.add('book-button');

                bookNowButton.addEventListener('click', () => {
                    const username = localStorage.getItem('loggedInUser');
                    if (!username) {
                        alert('Please login first to book a movie!');
                        window.location.href = "login.html";
                        return;
                    }

                    const booking = {
                        username: username,
                        movieTitle: movie.title,
                        bookedAt: new Date().toISOString()
                    };

                    fetch('http://localhost:8080/api/bookings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(booking)
                    })
                    .then(response => {
                        if (response.ok) {
                            //  Save booking to localStorage for bookings.html
                            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

                            bookings.push({
                                title: movie.title,
                                bookedAt: booking.bookedAt
                            });

                            localStorage.setItem('bookings', JSON.stringify(bookings));

                            alert('Booking successful! ');
                        } else {
                            alert('Booking failed. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error booking movie:', error);
                        alert('An error occurred while booking.');
                    });
                });

                movieCard.appendChild(bookNowButton);
                moviesDiv.appendChild(movieCard);
            });
        })
        .catch(error => console.error('Error loading movies:', error));
}

// Show welcome message if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('loggedInUser');
    if (username) {
        const welcome = document.getElementById('welcome-message');
        if (welcome) {
            welcome.textContent = `Welcome, ${username}! `;
        }
    }

    loadMovies();
});

// Logout button handler
document.getElementById('logout-button')?.addEventListener('click', function () {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('bookings');
    alert('You have been logged out!');
    window.location.href = "login.html";
});
