import { POST, GET } from '../client_request.js';
import { get_data, new_data } from '../local_data.js';

let current_movie_id = ''

function action_clicked(e,name,widget){
    if (name == 'add-movie')add_movie(e,widget)
    if (name == 'remove-movie')remove_movie(e)
    if (name == 'modify-movie')modify_movie(e,widget)
}


function getFormattedPremiereDate() {
  const rawDate = document.getElementById("premiere-date").value;

  if (!rawDate) return ""; // or return null/undefined as needed

  const readableDate = new Date(rawDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return readableDate;
}


function load_modal(name){
    const modal = document.getElementById(`movie-form-modal-${name}`);
    const openBtn = document.getElementById(`open-form-btn-${name}`);
    const closeBtn = document.getElementById(`close-form-btn-${name}`);

    const widgets = {
        modal: modal,
        action_button: modal.querySelector('button'),
        img: modal.querySelector('img'),
        img_url_input: modal.querySelector('#movie-image'),
        movie_title_input: modal.querySelector('#movie-title'),
        movie_description_input: modal.querySelector('#movie-description'),
        movie_id: modal.querySelector("#movie-id"),
        price_input: modal.querySelector("#price"),
        date_input: modal.querySelector("#premiere-date")
    }

    widgets.action_button.addEventListener('click', function(e){
        action_clicked(e,name,widgets)
    })

    if (widgets.movie_id){
      widgets.movie_id.addEventListener('input', (e) => {
       movie_id_changed(e,widgets.movie_id.value, widgets,name)
      })
    }

    if (widgets.img_url_input){
        widgets.img_url_input.addEventListener("input", () => { widgets.img.src = widgets.img_url_input.value;});
    }
    
    openBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      modal.classList.add("fade-in");
      modal.classList.remove("fade-out");

      load_action(name)
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("fade-in");
      modal.classList.add("fade-out");
      setTimeout(() => {
        modal.style.display = "none";
      }, 400);
    });
}

function load_action(name){
    const modal = document.getElementById(`movie-form-modal-${name}`);
    const openBtn = document.getElementById(`open-form-btn-${name}`);
    const closeBtn = document.getElementById(`close-form-btn-${name}`);

    const action_button = modal.querySelector('button')
    const img = modal.querySelector('img')
    const img_url_input = modal.querySelector('#movie-image')
    const movie_title_input = modal.querySelector('#movie-title')
    const movie_description_input = modal.querySelector('#movie-description')
    if (name=='add-movie'){
        img.src = ''
        img_url_input.value = ''
        movie_title_input.value = ''
        movie_description_input.value = ''
        modal.querySelector('#price').value = ''
        modal.querySelector('#premiere-date').value = ''

        return
    }
    if (name =='remove-movie'){

        return
    }
    if (name == 'modify-movie'){

        return
    }
}

function value_exist(notice, value){
    return value.value != ''
}

function add_movie(e,widget){
    let errors = []
      if (!value_exist(
        widget.movie_title_input.nextElementSibling,
        widget.movie_title_input
      )){errors.push("Please input a movie title")}
      
      if (!value_exist(
        widget.movie_description_input.parentElement.nextElementSibling,
        widget.movie_description_input
      )){errors.push('Please input a movie description')}
      
      if (!value_exist(
        widget.img_url_input.nextElementSibling,
        widget.img_url_input
      )){errors.push('Please input a image')};

      if (!value_exist(
        widget.price_input,
        widget.price_input
      )){errors.push('Please input a price')};

      if (!value_exist(
        widget.date_input,
        widget.date_input
      )){errors.push('Please input a premiere date')};

      if (errors.length > 0) {
        alert("Please correct the following errors:\n\n" + errors.join("\n"));
        return false;
      }
      
      // add movie logic
      const result = POST(e,{uri: '/add_movie', data:{
        name: widget.movie_title_input.value,
        description: widget.movie_description_input.value,
        image: widget.img_url_input.value,
        price: widget.price_input.value,
        premiere_date: widget.date_input.value
      }})

      result.then((data) => {
        if (data.status == 'success'){
          alert("Movie successfully added!")
          location.reload()
        }})
}

function remove_movie(e){
  if (!current_movie_id){
    return
  }

  const result = POST(e,{uri: '/remove_movie', data:{
      id: current_movie_id
  }})

  result.then((data) => {
    if (data.status == 'success'){
      alert("Movie successfully removed!")
      location.reload()
    }})
}

function modify_movie(e,widget){
  let errors = []
  if (!value_exist(
    widget.movie_title_input.nextElementSibling,
    widget.movie_title_input
  )){errors.push("Please input a movie title")}
  
  if (!value_exist(
    widget.movie_description_input.parentElement.nextElementSibling,
    widget.movie_description_input
  )){errors.push('Please input a movie description')}
  
  if (!value_exist(
    widget.img_url_input.nextElementSibling,
    widget.img_url_input
  )){errors.push('Please input a image')};

  if (!value_exist(
    widget.price_input,
    widget.price_input
  )){errors.push('Please input a price')};

  if (!value_exist(
    widget.date_input,
    widget.date_input
  )){errors.push('Please input a premiere date')};

  if (errors.length > 0) {
    alert("Please correct the following errors:\n\n" + errors.join("\n"));
    return false;
  }

   // add movie logic
   const result = POST(e,{uri: '/modify_movie', data:{
    name: widget.movie_title_input.value,
    description: widget.movie_description_input.value,
    image: widget.img_url_input.value,
    id: current_movie_id,
    premiere_date: widget.date_input.value,
    price: widget.price_input.value

  }})

  result.then((data) => {
    if (data.status == 'success'){
      alert("Movie successfully modified!")
      location.reload()
    }})
}

function movie_id_changed(e,value,widget,name){
  const movies = GET(e,'/movies')

  movies.then((movies) => {
    const movie = movies.find(m => m.id ===  Number(value));
    if (movie && movie.display !== false) {
      // load
      if (name === 'remove-movie'){
        widget.movie_title_input.innerHTML = movie.name
        widget.movie_description_input.innerHTML = movie.description
        widget.img.src = movie.image
        widget.action_button.style.display = 'flex'
      }

      if (name === 'modify-movie'){
        widget.modal.querySelector('#movie-name').innerHTML = 'Title'
        widget.movie_title_input.value = movie.name
        widget.movie_title_input.style.display = 'flex'

        widget.modal.querySelector('#movie-description-title').innerHTML = 'Description'
        widget.movie_description_input.value = movie.description;
        widget.movie_description_input.style.display = 'flex';

        widget.modal.querySelector('#movie-image-title').innerHTML = 'Image'
        widget.img.src = movie.image;
        widget.img_url_input.value = movie.image
        widget.img_url_input.style.display = 'flex'
        widget.modal.querySelector('.form-right').style.display = 'flex';

        widget.price_input.style.display = 'flex'
        widget.price_input.value = movie.price
        document.getElementById("price").value = widget.price_input.value
        document.getElementById("price_").innerText = "Price"

        widget.date_input.style.display = 'flex'
        widget.date_input.value = movie.premiere_date
        document.getElementById("premiere-date_").innerHTML = "Premiere Time"
      }


      current_movie_id = Number(value)
    }
    else{
      // unload
      if (name === 'remove-movie'){
        widget.movie_title_input.innerHTML = ''
        widget.movie_description_input.innerHTML = ''
        widget.img.src = ''
        widget.action_button.style.display = 'none'
      }

      if (name === 'modify-movie'){
        widget.modal.querySelector('#movie-name').innerHTML = ''
        widget.movie_title_input.value = ''
        widget.movie_title_input.style.display = 'none'

        widget.modal.querySelector('#movie-description-title').innerHTML = ''
        widget.movie_description_input.value = '';
        widget.movie_description_input.style.display = 'none';

        widget.modal.querySelector('#movie-image-title').innerHTML = ''
        widget.img.src = '';
        widget.img_url_input.value = ''
        widget.img_url_input.style.display = 'none'

        document.getElementById("price").innerHTML = ""
        document.getElementById("price").value = ""
        document.getElementById("price_").style.display = "none"
        document.getElementById("price").style.display = "none"

        document.getElementById("premiere-date").innerHTML = ""
         document.getElementById("premiere-date_").innerHTML = ""
        document.getElementById("premiere-date").style.display = "none"
        document.getElementById("premiere-date_").style.display = "none"
    }}
  });
}

const user_ = get_data('user')

const Users = GET(null,'/users')
Users.then((user) => {
  user.users.forEach(element => {
    if (element.email === user_.email){
      if (element.id !== 1){
        if (confirm("You are not admim. Confirm to be redirected home")) {
          window.location.href = "../ui/home.html"; // Replace with your target URL
        }
        else{
          window.location.href = "../ui/home.html"; // Replace with your target URL
        }
      }
    }
  });
})

load_modal('add-movie')
load_modal('remove-movie')
load_modal('modify-movie')
