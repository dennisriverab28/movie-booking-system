import { POST, GET } from '../client_request.js';
import { get_data, new_data } from '../local_data.js';

let seat_selected = ''
let payment_method = ''

const seat_roles = {
    0: 'available',
    1: 'unavailable'
}

function getCurrentDayAndTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(undefined, options);
    const time = now.toLocaleTimeString();
    return `${date} at ${time}`;
  }
  
  // Example usage
  console.log(getCurrentDayAndTime());
  

function load_seats(movie){
    const rows = 4
    const cols = 5
    const seatGrid = document.getElementById('seat-grid');
    seatGrid.innerHTML = ''; // Clear existing content

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('seat-row');

        for (let j = 0; j < cols; j++) {

        const seat_data = movie.seats[i][j]
        const seat = document.createElement('button');
        seat.dataset.row = i;
        seat.dataset.col = j;
        seat.innerText = `${String.fromCharCode(65 + i)}${j + 1}`;
        
        seat.classList.add('seat', seat_roles[seat_data]);


        seat.addEventListener('click', () => {
            if (seat.classList.contains('unavailable')) return;
            
            // Toggle selected
            document.querySelectorAll('.seat.selected').forEach(s => {
            s.classList.remove('selected');
            s.classList.add('available');
            });

            seat.classList.remove('available');
            seat.classList.add('selected');
            seat_selected = seat.innerText
        });

        row.appendChild(seat);
        }

        seatGrid.appendChild(row);
    }
}

function load_movie(movie){
    document.getElementById('movie-title').innerHTML = movie.name
    document.getElementById('movie-description').innerHTML = movie.description
    document.getElementById('movie-poster').src = movie.image
    document.getElementById('movie-price').innerHTML = movie.price

    let w = 0
    let n = 0
    const t = Math.floor(w / n);  // `w` is the rating, `n` is the divisor
    let s = "";  // Initialize the stars string

    // Add filled stars
    for (let i = 0; i < t; i++) {
        s += "⭐";
    }

    // Add empty stars if the rating isn't a full 5 stars
    for (let i = t; i < 5; i++) {
        s += "☆";  // Empty star
    }

    console.log(s, t);  // Output the star rating


    document.getElementById('movie-rating').innerHTML = s

}

function able_to_book(){
    let errors = [];

    if (payment_method !== 'PayPal'){
        const cardname = document.getElementById('card-name').value.trim();
        const cardnumber = document.getElementById('card-number').value.trim();
        const expdate = document.getElementById('exp-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const zipcode = document.getElementById('zip-code').value.trim();
    
        if (cardname === '') errors.push("Name on card is required.");
        if (!/^\d{16}$/.test(cardnumber)) errors.push("Card number must be 16 digits.");
        if (!/^\d{2}\/\d{2}$/.test(expdate)) errors.push("Expiration date must be in MM/YY format.");
        if (!/^\d{3,4}$/.test(cvv)) errors.push("CVV must be 3 or 4 digits.");
        if (!/^\d{5}$/.test(zipcode)) errors.push("ZIP Code must be 5 digits.");
    }

    if (seat_selected === '') errors.push("Please select a seat")

    if (errors.length > 0) {
        alert("Please correct the following errors:\n\n" + errors.join("\n"));
        return false;
    }

    return true;
}

function bookTicket(e) {
    if (!able_to_book()){
        return
    }
    const result = POST(e,{uri: '/book_movie', data: {
        movie_id: movie_info.id,
        seat: seat_selected,
        price: movie_info.price || 5,
        date_booked: getCurrentDayAndTime(),
        email: user.email,
    }})
    // alert("Payment successful and ticket booked!");
    result.then((i) => {
        if (i.status !== 'success'){
            console.log("error")
        }
        else{
            if (confirm("Movie booked! Go to home page?")) {
                window.location.href = '../ui/home.html';
            }
            else{
                window.location.href = '../ui/home.html';
            }
        }
  })
}
  

function togglePaymentInputs() {
    const method = document.getElementById('payment-method').value;
    const info = document.getElementById('payment-info');
    // info.innerHTML = `You selected <strong>${method}</strong> as your payment method.`;
    payment_method = method
    if (method === 'Debit Card' || method === 'Credit Card'){
        document.getElementById('payment-form-debit').style.display = 'flex'
        document.getElementById('payment-form-paypal').style.display = 'none'
    }
    else if (method === 'PayPal'){
        document.getElementById('payment-form-debit').style.display = 'none'
        document.getElementById('payment-form-paypal').style.display = 'flex'
    }
}

const movie_info = get_data('movie')
const user = get_data('user')

document.getElementById('payment-method').addEventListener('input', function(e){
    togglePaymentInputs()
})

document.getElementById('book-button').addEventListener('click', function(e){
    bookTicket(e)
})

load_movie(movie_info)
load_seats(movie_info)
