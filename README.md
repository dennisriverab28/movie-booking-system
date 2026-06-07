# Movie Booking System

**Stack:** Node.js · Express.js · Vanilla JS · HTML/CSS  
**Type:** Full-Stack Web Application

---

## Overview

A full-stack movie booking web application with user authentication, a movie catalog, seat booking, a personal wishlist, reviews/ratings, and an admin panel — all backed by a Node.js/Express REST API with JSON-file persistence.

---

## Features

| Feature | Description |
|---------|-------------|
| **User Auth** | Sign up, login, session-based access |
| **Movie Catalog** | Browse all available movies with details |
| **Ticket Booking** | Book movie tickets, view/cancel bookings |
| **Wishlist** | Add/remove movies from personal wishlist |
| **Reviews & Ratings** | Submit reviews and star ratings per movie |
| **Admin Panel** | Add, edit, and remove movies from catalog |
| **REST API** | Express backend with JSON endpoints |
| **JSON Persistence** | User and movie data stored in `src/data/*.json` |

---

## Project Structure

```
Movie_Booking_System/
├── server.js                        # Express server + all API routes
├── package.json
├── .env.example                     # Copy to .env and set PORT
│
├── public/
│   ├── index.html                   # App entry point
│   ├── index.js                     # Entry JS
│   ├── src/
│   │   ├── backend/
│   │   │   ├── movies.js            # Movie CRUD logic
│   │   │   └── users.js             # User/ticket/wishlist logic
│   │   ├── frontend/
│   │   │   ├── home.js              # Home page controller
│   │   │   ├── login.js             # Login logic
│   │   │   ├── signup.js            # Registration logic
│   │   │   ├── bookMovie.js         # Booking flow
│   │   │   ├── myBookings.js        # View/cancel bookings
│   │   │   ├── wishlist.js          # Wishlist management
│   │   │   └── admin.js             # Admin panel logic
│   │   ├── ui/
│   │   │   ├── home.html            # Home page
│   │   │   ├── login.html           # Login page
│   │   │   ├── signup.html          # Registration page
│   │   │   ├── bookMovie.html       # Booking page
│   │   │   ├── myBookings.html      # My bookings page
│   │   │   ├── wishlist.html        # Wishlist page
│   │   │   ├── admin.html           # Admin page
│   │   │   ├── styles.css           # Main stylesheet
│   │   │   ├── booking.css          # Booking page styles
│   │   │   └── admin.css            # Admin panel styles
│   │   ├── data/
│   │   │   ├── movies.json          # Movie catalog (persistent storage)
│   │   │   └── users.json           # User accounts + bookings + wishlist
│   │   ├── client_request.js        # Fetch API wrapper
│   │   └── local_data.js            # Client-side data utilities
│
└── raider_movie_booking_frontend/   # Alternate frontend version
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users` | Get all users |
| POST | `/new_user` | Register a new user |
| POST | `/login` | Authenticate user |
| GET | `/movies` | Get all movies |
| POST | `/add_movie` | Add a movie (admin) |
| POST | `/remove_movie` | Remove a movie (admin) |
| POST | `/modify_movie` | Edit a movie (admin) |
| POST | `/book_movie` | Book a ticket |
| POST | `/cancel_movie` | Cancel a booking |
| POST | `/addToWishList` | Add movie to wishlist |
| POST | `/removeFromWishList` | Remove from wishlist |
| POST | `/submit_review` | Submit a movie review |

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your desired PORT (e.g., PORT=3000)
```

### 3. Start the server
```bash
node server.js
```

### 4. Open in browser
```
http://localhost:3000
```

---

## Notes

- Data is persisted in `public/src/data/movies.json` and `users.json` — no database required.
- The `other/` and `raider_movie_booking_frontend/` folders contain earlier frontend iterations.
- Passwords are stored in plaintext in the JSON data file — this is a course project, not production code.
