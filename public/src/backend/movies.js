const path = require('path');
const fs = require('fs');
const moviesFilePath = path.resolve(__dirname, "../data/movies.json")

const MOVIEDATA = {
    id: -1,
    name: '',
    description: '',
    image: '',
    reviews: [],
    display: true,
    seats: Array.from({ length: 4 }, () => Array(5).fill(0))  // 0 = vacant, 1 = occupied
}

function seatLabelToIndices(label) {
    const rowChar = label.charAt(0);           // e.g., "A"
    const colNum = parseInt(label.slice(1));   // e.g., "1"
  
    const row = rowChar.charCodeAt(0) - 65;     // "A" → 0, "B" → 1, etc.
    const col = colNum - 1;                    // "1" → 0, "2" → 1, etc.
  
    return [row, col];
  }  

function initiate(){
    fs.writeFileSync(moviesFilePath, JSON.stringify([], null, 2));
}

function valid_credential(value) {
    if (value === null) return false;
    if (typeof value !== 'string' || value === '') return false;
    return true;
}


function getMovies(){
    if (fs.existsSync(moviesFilePath)) {
        const data = fs.readFileSync(moviesFilePath);
        return JSON.parse(data);
    }
    else {
        initiate(); // create movies data
        return [];
    }
}

function change_seat_status(movie_id,seat_label,status){ // 0 = vacant, 1 = occupied
    const movies = getMovies()
    const movie = movies.find(m => m.id === movie_id);

    if (movie){
        pos = seatLabelToIndices(seat_label)
        movie.seats[pos[0]][pos[1]] = status
        fs.writeFileSync(moviesFilePath, JSON.stringify(movies, null, 2));
        return true
    }

    return false
}

function newMovie(description){
    const movies = getMovies();

    const newMovieData = {
        ...MOVIEDATA,
        ...description,
        id: movies.length + 1,  // Ensure the ID is always unique and correct
    };

    movies.push(newMovieData);
    fs.writeFileSync(moviesFilePath, JSON.stringify(movies, null, 2));
}

function removeMovie(id){
    const movies = getMovies()
    const movie = movies.find(m => m.id === id);
    if (movie) movie.display = false;

    fs.writeFileSync(moviesFilePath, JSON.stringify(movies, null, 2));
}

function modifyMovie(updatedData) {
    const movies = getMovies();

    const index = movies.findIndex(m => m.id === updatedData.id);

    if (index === -1) {
        console.error(`Movie with id ${updatedData.id} not found.`);
        return;
    }

    // Update the existing movie by merging the data
    movies[index] = {
        ...movies[index],
        ...updatedData
    };

    fs.writeFileSync(moviesFilePath, JSON.stringify(movies, null, 2));
}


function newReview(info,res){
    const movie_id = info.movie_id
    const movies = getMovies()
    const movie = movies.find(m => m.id === movie_id);

    if (movie) {
        movie.reviews.push({
            note: info.note,
            rating: info.rating,
            user: info.user,
            time_posted: info.time_posted
        });
        fs.writeFileSync(moviesFilePath, JSON.stringify(movies, null, 2));
        return res.status(200).send({status: 'success', message: 'Review Added!'})
    }
    return res.status(400).send({status: 'failed', message: 'Movie not found!'})

    
    }

function newRating(){
    // calculate rating
}

module.exports = {
    newMovie,
    removeMovie,
    newReview,
    newRating,
    modifyMovie,
    getMovies,
    change_seat_status
}