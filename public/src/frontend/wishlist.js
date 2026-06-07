import { POST, GET } from '../client_request.js';
import { get_data, new_data } from '../local_data.js';
let selectedRating = null;
let selected_movie = null;

function getCurrentDayAndTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(undefined, options);
    const time = now.toLocaleTimeString();
    return `${date} at ${time}`;
  }

function loadMovies() {
    const container = document.getElementById('movie-list');
    if (!container) return;
    container.innerHTML = '';  // Clear existing content

    const user_ = get_data('user')
        const users = GET(null, '/users')
        users.then((data) => {
            const user = data.users.find(m => m.email === user_.email)
    
            const result = GET(null, '/movies');
            result.then((movies) => {
                movies.forEach((m, idx) => {
                    if (m.display && user.wishlist.includes(m.id)){
                        const card = document.createElement('div');
                        card.className = 'movie-card';
                        card.innerHTML = `
                        <img src="${m.image}"
                            alt="${m.name}"
                            class="movie-poster"
                            style="cursor:pointer">
                        <h3 style="cursor:pointer; color: #000000">${m.name}</h3>
                        <button class="book-button">View</button><br>
                        <button class="book-button">Remove to Wishlist</button>
                        `;
                        // <p style="color: #000000"> ${m.description}</p>
    
                        // Add event listeners here
                        const img = card.querySelector('img');
                        const title = card.querySelector('h3');
                        const button = card.querySelector('button');
                        const wishlitst_bitton = button.nextElementSibling.nextElementSibling
    
                        // Bind the click event to call selectMovie with the correct index
                        img.addEventListener('click', () => viewMovie(m));
                        title.addEventListener('click', () => viewMovie(m));
                        button.addEventListener('click', () => viewMovie(m));
                        wishlitst_bitton.addEventListener('click', () => removeMovieToWishList(m.id));
    
                        container.appendChild(card);
                    }
                });
            }).catch((error) => {
                console.error('Error loading movies:', error);
            });
        })
}

function removeMovieToWishList(movie_id){
    const user = get_data('user')
    const result = POST(null, {uri:'/removeFromWishList', data: {movie_id: movie_id, email: user.email}})

    result.then((data) => {
        if (data.status === "success"){
            confirm(data.message)
            location.reload()
            return
        }
        alert(data.message)
    })
}

function openModal(movie_info) {
    const image = document.getElementById('movie-poster')
    const title = document.getElementById('movie-title')
    const description = document.getElementById('movie-description')
    const review = document.getElementById('reviews-container')
    const premiere_date = document.getElementById('premiere-date')
    review.innerHTML = ''
    // load reviews

    let n = 0
    let w = 0
    movie_info.reviews.forEach(i => {
        const container = document.getElementById("reviews-container");

        const reviewDiv = document.createElement("div");
        reviewDiv.style.borderBottom = "1px solid #aaa";
        reviewDiv.style.padding = "6px 0";

        let stars = "";
        const fullStars = Math.floor(i.rating);  // Number of filled stars
        const emptyStars = 5 - fullStars;        // Number of empty stars
        
        // Add filled stars
        for (let j = 0; j < fullStars; j++) {
          stars += "⭐";
        }
        
        // Add empty stars
        for (let j = 0; j < emptyStars; j++) {
          stars += "☆";
        }
        
        reviewDiv.innerHTML = `
            <strong>${i.user}</strong> - ${stars}<br>
            <em style="font-size: 12px; color: white;">${i.time_posted}</em><br>
            <p style="margin: 4px 0;">${i.note}</p>
        `;

        w+= i.rating
        n+=1
        container.appendChild(reviewDiv);
    })

    const t = Math.floor(w / n) 
    let s = "";
    for (let i = 0; i < t; i++) {
      s += "⭐";
    }
    // Add empty stars if the rating isn't a full 5 stars
    for (let i = t; i < 5; i++) {
    s += "☆";  // Empty star
    }
    document.getElementById('movie-rating').innerHTML = s

    title.innerHTML = movie_info.name
    description.innerHTML = movie_info.description
    image.src = movie_info.image;

    const readableDate = new Date(movie_info.premiere_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    premiere_date.innerHTML = `Premiere date: ${readableDate}`

    selected_movie = movie_info.id

    new_data('movie', movie_info)

    document.getElementById('movie-modal').style.display = 'flex';
}

function openReviewModal() {
    document.getElementById('review-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('movie-modal').style.display = 'none';
    // remove all information
}

function viewMovie(movie_info) {
    openModal(movie_info)
}

function addMovieToWishList(movie_id){
    const user = get_data('user')
    const result = POST(null, {uri:'/addToWishList', data: {movie_id: movie_id, email: user.email}})

    result.then((data) => {
        if (data.status === "success"){
            confirm(data.message)
            location.reload()
            return
        }
        alert(data.message)
    })
}

const user = get_data('user')
document.getElementById('welcome-message').innerHTML = `Welcome back ${user.username}!`
// load the movies when the user goes to the home page
loadMovies();

// close the movie you are currently viewing
document.getElementById('close-button').addEventListener('click', function(e){
    closeModal()
})

document.getElementById('purchase-ticket').addEventListener('click', function(e){
    if (get_data('movie') === undefined || get_data('user') === undefined){
        console.log("Can not purchase ticket(s)", get_data('movie') === undefined, get_data('user') === undefined)
        return
    }
    
    window.location.href = '../ui/bookMovie.html'
})

document.getElementById('leave-review').addEventListener('click', function(e){
    openReviewModal()
})

document.getElementById('submit-review').addEventListener('click', function(e){
    let errors = [];
    if (selectedRating === null){errors.push("Please leave a rating")}
    if (document.getElementById('review-text').value === '') {errors.push("Please leave a review")}
    if (selected_movie === null){errors.push("Movie is not selected")}
    if (errors.length > 0) {
        alert("Please correct the following errors:\n\n" + errors.join("\n"));
        return false;
    }

    // submite review to the server
    const result = POST(null, {uri:'/submit_review', data: {
        note: document.getElementById('review-text').value,
        rating: selectedRating,
        user: get_data('user').username,
        time_posted: getCurrentDayAndTime(),
        movie_id: selected_movie,
    }})

    result.then((data) => {
        alert(data.message)
        if (data.status === "success"){
            document.getElementById('review-text').value = ''
            document.getElementById('review-modal').style.display = 'none';
            selectedRating = null
            location.reload()
            return
        }
    })

})

document.getElementById('close-review-button').addEventListener('click', function(e){
    document.getElementById('review-text').value = ''
    document.getElementById('review-modal').style.display = 'none';
    selectedRating = null
})

const ratingButtons = document.querySelectorAll('#rating-buttons .rating-btn');
ratingButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRating = parseInt(btn.dataset.rating);
    console.log(selectedRating)
    // Highlight all buttons up to the selected one
    ratingButtons.forEach(b => {
        const sr = parseInt(b.dataset.rating)
        b.style.backgroundcolor = 'red'
        console.log(b.style.backgroundcolor)
    //   if (parseInt(b.dataset.rating) <= selectedRating) {
    //     b.classList.add('selected');
    //   } else {
    //     b.classList.remove('selected');
    //   }
    });
  });
});