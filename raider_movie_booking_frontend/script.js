// 1) Movie “database”
const movies = [
    {
      name: "Avengers: Endgame",
      description: "After the devastating events of Infinity War, the Avengers assemble once more.",
      image: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
      rating: 5,
      reviews: ["Epic finale!","Loved every second!","Masterpiece!"],
      price: 12.99
    },
    {
      name: "Inception",
      description: "A thief who steals corporate secrets through dream-sharing technology.",
      image: "https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg",
      rating: 4,
      reviews: ["Mind-bending!","Brilliant!","Amazing visuals!"],
      price: 11.99
    },
    {
      name: "Interstellar",
      description: "A group of astronauts travel through a wormhole in search of a new home.",
      image: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
      rating: 5,
      reviews: ["Breathtaking!","Emotional!","Stunning!"],
      price: 10.99
    }
  ];
  
  // 2) Seat‐grid rows/cols
  const seatRows = ["A","B","C","D","E"];
  const seatCols = [1,2,3,4,5];
  let selectedSeat = null;
  
  // 3) Home page: render & open in new tab
  function loadMovies() {
    const c = document.getElementById('movie-list');
    if (!c) return;
    c.innerHTML = '';
    movies.forEach((m,i)=>{
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${m.image}" alt="${m.name}" class="movie-poster"
             style="cursor:pointer" onclick="selectMovie(${i})">
        <h3 style="cursor:pointer" onclick="selectMovie(${i})">${m.name}</h3>
        <p>${m.description}</p>
        <button onclick="selectMovie(${i})" class="book-button">Book Now</button>
		<button onclick="addToWishlist('${m.name}')" class="book-button">Add to Wishlist</button>
      `;
      c.appendChild(card);
    });
  }
  
  function selectMovie(i) {
    localStorage.setItem('selectedIndex', i);
    window.open('movie_details.html', '_blank');
  }
  
  // 4) Details page: populate + draw seat grid
  function loadSelectedMovie() {
    const idx = localStorage.getItem('selectedIndex');
    if (idx===null) return;
    const m = movies[+idx];
  
    document.getElementById('movie-poster').src         = m.image;
    document.getElementById('movie-title').textContent  = m.name;
    document.getElementById('movie-description').textContent = m.description;
    document.getElementById('movie-rating').textContent = m.rating;
    document.getElementById('movie-price').textContent  = m.price.toFixed(2);
  
    // reviews
    const rv = document.getElementById('reviews-container');
    rv.innerHTML = '';
    m.reviews.forEach(r=>{
      const p = document.createElement('p');
      p.textContent = r;
      rv.appendChild(p);
    });
  
    togglePaymentInputs();
    renderSeatGrid(m.name);
  }
  
  // 5) Draw 5×5 seat map
  function renderSeatGrid(movieName) {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '';
    selectedSeat = null;
    document.getElementById('seat-error').style.display = 'none';
  
    const bookedSet = new Set(
      JSON.parse(localStorage.getItem('bookings')||'[]')
        .filter(b=>b.movie===movieName)
        .map(b=>b.seat)
    );
  
    seatRows.forEach(r=>{
      seatCols.forEach(c=>{
        const id = `${r}${c}`;
        const cell = document.createElement('div');
        cell.classList.add('seat');
        if (bookedSet.has(id)) {
          cell.classList.add('seat-unavailable');
          cell.textContent = '×';
        } else {
          cell.classList.add('seat-available');
          cell.textContent = id;
          cell.onclick = ()=>{
            // clear old
            grid.querySelectorAll('.selected')
                .forEach(x=>x.classList.remove('selected'));
            cell.classList.add('selected');
            selectedSeat = id;
          };
        }
        grid.appendChild(cell);
      });
    });
  }
  
  // 6) Payment toggle
  function togglePaymentInputs() {
    const m = document.getElementById('payment-method').value;
    const info = document.getElementById('payment-info');
    if (m==="PayPal") {
      info.innerHTML = `<p>You will be forwarded to PayPal.</p>`;
    } else {
      info.innerHTML = `
        <input id="card-number" placeholder="Card Number"><br>
        <input id="card-expiration" placeholder="MM/YY"><br>
        <input id="card-cvv" placeholder="CVV"><br>
      `;
    }
  }
  
  // 7) Pay & Book
  function payAndBook() {
    if (!selectedSeat) {
      document.getElementById('seat-error').style.display = 'block';
      return;
    }
  
    const idx    = localStorage.getItem('selectedIndex');
    const m      = movies[+idx];
    const method = document.getElementById('payment-method').value;
  
    if (method!=="PayPal") {
      const num = document.getElementById('card-number').value.trim();
      const exp = document.getElementById('card-expiration').value.trim();
      const cvv = document.getElementById('card-cvv').value.trim();
      if (!num||!exp||!cvv) {
        alert("Please fill all card fields.");
        return;
      }
    }
  
    const booking = {
      movie:   m.name,
      seat:    selectedSeat,
      payment: method,
      price:   m.price.toFixed(2),
      time:    new Date().toLocaleString()
    };
  
    const arr = JSON.parse(localStorage.getItem('bookings')||'[]');
    arr.push(booking);
    localStorage.setItem('bookings', JSON.stringify(arr));
  
    alert("Booking successful!");
    window.location.href = 'bookings.html';
  }
  
  // 8) Load bookings
  function loadBookings() {
    const all = JSON.parse(localStorage.getItem('bookings')||'[]');
    const c = document.getElementById('bookings-container');
    c.innerHTML = '';
    if (!all.length) {
      c.innerHTML = '<p>No bookings yet. Book a movie first! 🎬</p>';
      return;
    }
    all.forEach(b=>{
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <h3>${b.movie}</h3>
        <p><strong>Seat:</strong> ${b.seat}</p>
        <p><strong>Payment:</strong> ${b.payment}</p>
        <p><strong>Price:</strong> $${b.price}</p>
        <p><em>Booked on ${b.time}</em></p>
      `;
      c.appendChild(card);
    });
  }
  
  
  //WishList
  function addToWishlist(movieTitle) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      if (!wishlist.includes(movieTitle)) {
          wishlist.push(movieTitle);
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
          alert(movieTitle + " added to wishlist!");
      } else {
          alert(movieTitle + " is already in the wishlist!");
      }
  }

  function loadWishlist() {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      let container = document.getElementById("wishlist-container");

      if (!container) return;

      container.innerHTML = ""; // Clear previous entries

      if (wishlist.length === 0) {
          container.innerHTML = "<p>No movies in wishlist. Start adding some! 🎬</p>";
          return;
      }

      wishlist.forEach((movieTitle) => {
          let movie = movies.find(m => m.name === movieTitle);
          if (!movie) return;

          let card = document.createElement("div");
          card.className = "movie-card";
          card.innerHTML = `
              <img src="${movie.image}" alt="${movie.name}" class="movie-poster" style="cursor:pointer">
              <h3>${movie.name}</h3>
              <p>${movie.description}</p>
              <div class="button-container">
                  <button onclick="goToMovie('${movie.name}')" class="book-button">Book Now</button>
                  <button onclick="removeFromWishlist('${movie.name}')" class="book-button">Remove</button>
              </div>
          `;
          container.appendChild(card);
      });
  }



  function removeFromWishlist(movieTitle) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist = wishlist.filter(movie => movie !== movieTitle);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      loadWishlist();
  }
  

  function goToMovie(movieTitle) {
      let movieIndex = movies.findIndex(m => m.name === movieTitle);
      if (movieIndex !== -1) {
          localStorage.setItem("selectedIndex", movieIndex);
          window.open("movie_details.html", "_blank");
      }
  }
  
  
  // 9) Auto‐init
  document.addEventListener('DOMContentLoaded', ()=>{
    if (document.getElementById('movie-list'))        loadMovies();
    if (document.getElementById('reviews-container')) loadSelectedMovie();
    if (document.getElementById('bookings-container')) loadBookings();
	if (document.getElementById("wishlist-container")) loadWishlist();
  });
  