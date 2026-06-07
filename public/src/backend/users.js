const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');
const usersFilePath = path.resolve(__dirname, "../data/users.json")

const { change_seat_status } = require('./movies')

const USERDATA = {
    username: "",
    email: "",
    password: "",
    id: -1,
    tickets: [], // json
    wishlist: [], // array
    is_admin: false,
}

const ticket = {
    id: '', // ticket id
    movie_id: -1,
    ticket_id: '',
    movie_name: '',
    movie_description: '',
    seat: '', // 2d array flattend into 1d
    active: false, // is ticket has been used
    price: 0,
    premiere_date: '', // date of the movie
    date_booked: ''
}

allowed_keys = ['id','movie_id','movie_name','movie_description','seat','active','price','premiere_date','date_booked']

// Filter each object by allowed keys
function filterByKeys(obj, keys) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => keys.includes(key))
    );
  }

function generateTicketId() {
    function getSegment() {
        return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    }

    return `${getSegment()}-${getSegment()}-${getSegment()}-${getSegment()}`;
}

function saveUsers(users){
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function getUsers(){
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    }
    else {
        const initialData = [];
        saveUsers(initialData);
        return initialData;
    }
}

function newTicket(movie,info){
    let t = {
        ...ticket,
        ...filterByKeys(info,allowed_keys),
        ...filterByKeys(movie,allowed_keys),
        ticket_id: generateTicketId(),
        movie_name: movie.name,
        active: true
    }

    const users = getUsers()
    const user = users.find(m => m.email === info.email);
    user.tickets.push(t)

    change_seat_status(movie.id,info.seat,1)
    saveUsers(users);
}

function removeTicket(ticket, res){
    const users = getUsers()
    const user = users.find(m => m.email === ticket.email);
    
    if (user) {
        const ticket_index = user.tickets.findIndex(m => m.ticket_id === ticket.ticket_id);
        if (ticket_index !== -1) {
            change_seat_status(ticket.movie_id, ticket.seat, 0);
            user.tickets[ticket_index].active = false;
            saveUsers(users);
            return res.status(200).send({status: 'success', message: 'Ticket Removed!'})
        } else {
            console.log("Ticket not found in user's list");
            return res.status(400).send({status: 'failed', message: 'Ticket not found'})
        }
    } else {
        console.log("User not found");
        return res.status(400).send({status: 'failed', message: 'User not found'})
    }
}
function newUser({username, email, password}){
    const newUserInfo = {username: username, email: email, password: password};

    // no email or username
    if (!newUserInfo.username || !newUserInfo.email || !newUserInfo.password) {
        return [400, {status: "failed", message: "No name, email, or password provided"}];
    }

    // if user already exist
    for (const currentUsers of getUsers()) {
        if (currentUsers.email === newUserInfo.email) {
            return [400, {status: "failed", message: "Email already exists"}];
        }
    }

    // if user already exist
    for (const currentUsers of getUsers()) {
        if (currentUsers.username === newUserInfo.username) {
            return [400, {status: "failed", message: "Username already exists"}];
        }
    }

    const users = getUsers();

    let newUser = {
        ...USERDATA,
        username: newUserInfo.username,
        email: newUserInfo.email,
        password: newUserInfo.password,
        id: users.length + 1,
    }

    // save to database
    saveUsers([...users, newUser]);
    return [200, {status: "success", message: "User created", data: newUser}];
}

function userExist(email){
    // if user already exist
    for (const currentUsers of getUsers()) {
        if (currentUsers.email === email) {
            return true;
            // return res.status(400).send({status: "failed", message: "User already exists"});
        }
    }
}

function addToWishList(movie_id, email, res) {
    const users = getUsers();
    const user = users.find(m => m.email === email);

    if (!user) {
        return res.status(400).send({ status: "failed", message: "User not found" });
    }

    if (!Array.isArray(user.wishlist)) {
        user.wishlist = [];
    }

    if (user.wishlist.includes(movie_id)) {
        return res.status(400).send({ status: "failed", message: "Movie is already in wishlist!" });
    }

    user.wishlist.push(movie_id);
    saveUsers(users);
    return res.status(200).send({ status: "success", message: "Movie added to wishlist" });
}


function removeFromWishList(movie_id, email, res) {
    const users = getUsers();
    const user = users.find(m => m.email === email);

    if (!user) {
        return res.status(400).send({ status: "failed", message: "User not found" });
    }

    if (!Array.isArray(user.wishlist)) {
        user.wishlist = [];
    }

    const index = user.wishlist.indexOf(movie_id);
    if (index !== -1) {
        user.wishlist.splice(index, 1); // Remove the movie
        saveUsers(users);
        return res.status(200).send({ status: "success", message: "Movie removed from wishlist!" });
    }

    return res.status(400).send({ status: "failed", message: "Movie is not in the wishlist" });
}


module.exports = {
    saveUsers,
    getUsers,
    newUser,
    userExist,
    newTicket,
    removeTicket,
    addToWishList,
    removeFromWishList
}
