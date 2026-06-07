// for keeping track on who is signed in
// if the user signed out then the local_data will be removed

function data_exist(){
    return (localStorage.getItem('user'))
}

export function new_data(name,data){
    if (data_exist()){remove_data}
    localStorage.setItem(name, JSON.stringify(data));
}

export function remove_data(name){
    localStorage.removeItem(name)
}

export function clear(){
    localStorage.clear()
}

export function get_data(name) {
    const userString = localStorage.getItem(name);
    if (!userString) return null;

    try {
        const user = JSON.parse(userString);
        return user;  // Access with user.username, user.email
    } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
    }
}