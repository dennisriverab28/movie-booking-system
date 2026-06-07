import { POST, GET } from '../client_request.js'
import { new_data, remove_data } from '../local_data.js'

const username = document.getElementById('username')
const password = document.getElementById('password')
const signin_button = document.getElementById('signin')

function username_exist(){
    username.nextElementSibling.nextElementSibling.style.display = username.value == '' ? 'Block' : 'none'
    return username.value != ''
}

function password_exist(){
    password.nextElementSibling.nextElementSibling.style.display = password.value == '' ? 'Block' : 'none'
    return password.value != ''
}


function signin(e){
    e.preventDefault()
    if ((password_exist() & username_exist()) == false){
        console.log("unable to login account")
        signin_button.nextElementSibling.style.display = 'none'
        return
    }
    // sign in
    const result = POST(e,{uri:'/login', data: {username: username.value, password: password.value}})
    console.log(result)
    result.then((data) => {
        if (data.status === "success") {
            // add email to local client for easy access of getting their data
            new_data('user',{email:data.data.email, username:data.data.username})
            // redirect to home page
            window.location.href = '../ui/home.html'
            return
        }
            signin_button.nextElementSibling.innerHTML = data.message
            signin_button.nextElementSibling.style.display = 'Block'
        })
}

remove_data() // remove any data if the user opens the sign in/ signup page
signin_button.addEventListener('click', function(e) {
    signin(e);
  });
  