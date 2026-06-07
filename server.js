const express = require('express');
const path = require('path');
require("dotenv").config();

// modules
const {saveUsers, getUsers,newUser, newTicket, removeTicket, addToWishList, removeFromWishList} = require("./public/src/backend/users");
const { newMovie, removeMovie, newReview, newRating, modifyMovie, getMovies } = require('./public/src/backend/movies');


const app = express();
const PORT=process.env.PORT; 

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use(express.json());


// get all users
app.get("/users", async (req, res) => {
    console.log("k")
    const users = getUsers();
    console.log(users)
    res.json({
        count: users.length,
        users: users,
      });
})

app.post('/new_user', (req, res) =>{
    details = newUser(req.body.data)
    res.status(details[0]).send(details[1]);  //res.status(200).send({status: "success", message: "signup complete"});
}) 

app.post('/login', (req,res) =>{
    // if user already exist
    for (const currentUsers of getUsers()) {
        if (currentUsers.username === req.body.data.username && currentUsers.password === req.body.data.password) {
            console.log("user exist")
            return res.status(200).send({status: "success", data:{email: currentUsers.email, username: currentUsers.username}})
        }
    }
    return res.status(400).send({status: "failed", message: "Invalid username or password"})
})

app.get('/movies', (req,res) =>{
    return res.status(200).json(getMovies())
})

app.post('/add_movie', (req, res) => {
    newMovie(req.body.data)
    return res.status(200).send({status: 'success', message: 'Movie Added!'})
})

app.post('/remove_movie', (req, res) => {
    removeMovie(req.body.data.id)
    return res.status(200).send({status: 'success', message: 'Movie Removed!'})
})

app.post('/modify_movie', (req, res) => {
    modifyMovie(req.body.data)
    return res.status(200).send({status: 'success', message: 'Movie Modified!'})
})

app.post('/book_movie', (req, res) => {
    const movies = getMovies()
    const movie = movies.find(m => m.id === req.body.data.movie_id);
    if (!movie){
        return res.status(200).send({status: 'failed', message: 'Could not find movie'})
    }

    newTicket(movie, req.body.data)

    return res.status(200).send({status: 'success', message: 'Movie Added!'})
})

app.post('/cancel_movie', (req, res) => {
    return removeTicket(req.body.data, res)
})

app.post('/addToWishList', (req, res) => {
    return addToWishList(req.body.data.movie_id,req.body.data.email, res)
})

app.post('/removeFromWishList', (req, res) => {
    return removeFromWishList(req.body.data.movie_id,req.body.data.email, res)
})

app.post('/submit_review', (req, res) => {
    return newReview(req.body.data, res)
})

app.listen(PORT, () => {console.log(`Server running http://localhost:${PORT})"`);})
