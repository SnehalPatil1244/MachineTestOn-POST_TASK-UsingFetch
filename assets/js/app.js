const cl = console.log;

const PostForm = document.getElementById('PostForm')
const postcontainer = document.getElementById('postcontainer')
const titlecontrol = document.getElementById('title')
const bodycontrol = document.getElementById('body')
const userIdcontrol = document.getElementById('userId')
const addpostbtn = document.getElementById('addpostbtn')
const updatepostbtn = document.getElementById('updatepostbtn')
const spinner = document.getElementById('spinner')

const BASE_URL = `https://jsonplaceholder.typicode.com`
const POSTS_URL = `${BASE_URL}/posts`

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

//Read

function createposts(arr) {
    let result = '';
    for (let i = arr.length - 1; i >= 0; i--) {
        result += `
                <div class="col-md-4 mb-4" id="${arr[i].id}">
                        <div class="card h-100">
                            <div class="card-header">
                                <h3>${arr[i].title}</h3>
                            </div>
                            <div class="card-body">
                                <p class="m-0">${arr[i].body}</p>
                                 <h5><strong>UserId:</strong> ${arr[i].userId}</h5>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                <button onclick="onRemove(this)" class="btn btn-outline-danger btn-sm">Remove</button>

                            </div>
                        </div>

                    </div>`
        postcontainer.innerHTML = result;
    }
}

function fetchBlog() {
    spinner.classList.remove('d-none')
    fetch(POSTS_URL, {
        method: 'GET',
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "Token From LS"
        }
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            createposts(data)
        })
        .catch(err => {
            snackbar(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })

}
fetchBlog()

//create

function onpostsubmit(eve) {
    eve.preventDefault()
    let post_obj = {
        title: titlecontrol.value,
        body: bodycontrol.value,
        userId: userIdcontrol.value
    }

    const configobj = {
        method: 'POST',
        body: JSON.stringify(post_obj),
        headers: {
            "content-type": "application/json",
            "auth": "Token from local Storage"

        }
    }

    spinner.classList.remove('d-none')
    fetch(POSTS_URL, configobj)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                snackbar(`Something Went Wrong !!`, 'error')
            }
        })
        .then(data => {
            PostForm.reset()
            let col = document.createElement('div')
            col.className = `col-md-4 mb-4`
            col.id = data.id
            col.innerHTML = `
        <div class="card h-100">
                            <div class="card-header">
                                <h3>${data.title}</h3>
                            </div>
                            <div class="card-body">
                                <p class="m-0">${data.body}</p>
                                 <h5><strong>UserId:</strong> ${data.userId}</h5>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                <button  onclick="onRemove(this)"  class="btn btn-outline-danger btn-sm">Remove</button>

                            </div>
                        </div>`
            postcontainer.prepend(col)
            snackbar(`The  new Post With Id ${res.id} is Added Succefully !!`, 'success')
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })
}


//edit

function onEdit(ele) {
    let EDIT_ID = ele.closest('.col-md-4').id
    localStorage.setItem('EDIT_ID', EDIT_ID)
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`

    let configobj = {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "Token From LS"
        }
    }
    spinner.classList.remove('d-none')
    fetch(EDIT_URL, configobj)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            titlecontrol.value = data.title
            bodycontrol.value = data.body
            userIdcontrol.value = data.userId

            updatepostbtn.classList.remove('d-none')
            addpostbtn.classList.add('d-none')
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })
}
//update

function onpostupdate() {
    let UPDATE_ID = localStorage.getItem('EDIT_ID')
    let UPDATED_URL = `${BASE_URL}/posts/${UPDATE_ID}`

    let UPDATED_OBJ = {
        title: titlecontrol.value,
        body: bodycontrol.value,
        userId: userIdcontrol.value

    }
    let configobj = {
        method: 'PATCH',
        body: JSON.stringify(UPDATED_OBJ),
        headers: {
            "content-type": "application/json",
            "auth": "Token From LS"
        }
    }

    spinner.classList.remove('d-none')
    fetch(UPDATED_URL, configobj)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            PostForm.reset()
            let col = document.getElementById(data.id)
            let h3 = col.querySelector('.card-header h3')
            let p = col.querySelector('.card-body p')
            let h5 = col.querySelector('.card-body h5')

            h3.innerText = data.title
            p.innerText = data.body
            h5.innerText = data.userId

            addpostbtn.classList.remove('d-none')
            updatepostbtn.classList.add('d-none')
            todoForm.reset()
            snackbar(`The New post with id ${data.id} is Updated Successfully !!! `, 'success')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })
}


//delete

function onRemove(ele) {
    let REMOVE_ID = ele.closest('.col-md-4').id
    let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`

    let configobj = {
        method: "DELETE",
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "Token Form LS"
        }
    }

    Swal.fire({
        title: "Do you want to remove this?",
        showCancelButton: true,
        confirmButtonText: "REMOVE",
    }).then((result) => {
        if (result.isConfirmed) {
            spinner.classList.remove('d-none') /

                fetch(REMOVE_URL, configobj)
                    .then(res => {
                        if (res.ok) {
                            return res.json()
                        }
                    })
                    .then(() => {
                        ele.closest('.col-md-4').remove()
                        snackbar(`the post with id ${REMOVE_ID}is removed successfully !!!`, 'success')

                    })
                    .catch(err => {
                        cl(err)
                    })
                    .finally(() => {
                        spinner.classList.add('d-none')

                    })

        }


    });

}






PostForm.addEventListener('submit', onpostsubmit)
updatepostbtn.addEventListener('click', onpostupdate)
