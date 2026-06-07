import { POST, GET } from '../client_request.js';
import { get_data, new_data } from '../local_data.js';

const bookingsList = document.getElementById("bookings-list")

function new_book_card(ticket){
    // Get the hidden template card
    const template = document.querySelector('#bookings-list .movie-card');
        
    // Clone the template
    const newCard = template.cloneNode(true);
    newCard.style.display = 'block'; // Make it visible

    // Update the content
    newCard.querySelector('#ticket-id').textContent = ticket.ticket_id || 'unknown';
    newCard.querySelector('#movie-title').textContent = ticket.movie_name;
    newCard.querySelector('#movie-date-time').textContent = `Premiere Date: ${ticket.premiere_date}`;
    newCard.querySelector('#seat').textContent = `Seat: ${ticket.seat}`;

    newCard.querySelector('#cancel').addEventListener('click', (e) => {
        if (confirm("Are you sure you want to cancel this ticket?")){
            const result = POST(e,{uri: '/cancel_movie', data: ticket})
            result.then((u) => {
                if (u.status === "success"){
                    if (confirm("Ticket removed! Click OK to refresh the page.")) {
                        location.reload();
                    }
                    location.reload();
                }
                else{
                    alert(u.message)
                }
            })
        }
    });


    // Append the new card to the bookings list
    document.getElementById('bookings-list').appendChild(newCard);
}


const user = get_data('user')
const result = GET(null,'/users')

result.then((u) => {
    const my_user = u.users.find(m => m.email === user.email);
    if (my_user){
        my_user.tickets.forEach(ticket => {
            if (ticket.active == true){
                new_book_card({...ticket, email: user.email })
            }
        });
    }
})
