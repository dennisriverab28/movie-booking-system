import { POST, GET } from '../client_request.js'
import { new_data, remove_data } from '../local_data.js'

const username = document.getElementById('new-username')
const email = document.getElementById('new-email')
const password = document.getElementById('new-password')
const create_account = document.getElementById('create-account')

function username_exist(){
    username.nextElementSibling.nextElementSibling.style.display = username.value == '' ? 'Block' : 'none'
    return username.value != ''
}

function password_exist(){
    password.nextElementSibling.nextElementSibling.style.display = password.value == '' ? 'Block' : 'none'
    return password.value != ''
}

function email_exist(){
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    
    email.nextElementSibling.nextElementSibling.style.display = emailPattern.test(email.value) ? 'none' : 'Block'
    return emailPattern.test(email.value)
}

function signup(e){
    e.preventDefault()
    if ((email_exist() & password_exist() & username_exist()) == false){
        console.log("unable to create account")
        create_account.nextElementSibling.style.display = 'none'
        return
    }
    // create account
    const result = POST(e,{uri:'/new_user', data: {username: username.value, password: password.value, email: email.value}})
    console.log(result)
    result.then((data) => {
        console.log(data)
    if (data.status === "success") {
        // add email to local client for easy access of getting their data
        new_data('user',{email:email.value, username:username.value})
        // redirect to home page
        window.location.href = '../ui/home.html'
        return
    }
        create_account.nextElementSibling.innerHTML = data.message
        create_account.nextElementSibling.style.display = 'Block'
    })
}

remove_data() // remove any data if the user opens the sign in/ signup page
create_account.addEventListener('click', function(e) {
    signup(e);
  });
  