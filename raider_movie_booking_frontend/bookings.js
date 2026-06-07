document.addEventListener('DOMContentLoaded', function () {
    loadBookings();
});

function loadBookings() {
    const bookingList = document.getElementById('booking-list');
    bookingList.innerHTML = '';

    const username = localStorage.getItem('loggedInUser');
    if (!username) {
        alert('Please log in to view your bookings.');
        window.location.href = 'login.html';
        return;
    }

    fetch(`http://localhost:8080/api/bookings/user/${username}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch bookings.');
            }
            return res.json();
        })
        .then(bookings => {
            if (bookings.length === 0) {
                bookingList.innerHTML = '<p>No bookings yet. Book a movie first! 🎬</p>';
                return;
            }

            bookings.forEach(booking => {
                const bookingCard = document.createElement('div');
                bookingCard.classList.add('movie-card');

                const bookedAt = new Date(booking.bookedAt).toLocaleString();

                bookingCard.innerHTML = `
                    <h3>${booking.movieTitle}</h3>
                    <p>Booked on: ${bookedAt}</p>
                `;

                bookingList.appendChild(bookingCard);
            });
        })
        .catch(err => {
            console.error('Error loading bookings:', err);
            bookingList.innerHTML = '<p style="color:red;">Could not load bookings. Please try again later.</p>';
        });
}
