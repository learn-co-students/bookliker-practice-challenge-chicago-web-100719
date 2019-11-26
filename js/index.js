const ul = document.querySelector('ul');
const show = document.querySelector('#show-panel');
baseUrl = 'http://localhost:3000/books'

function renderBook(book) {
    const bookHtml = `<li id='${book.id}'>${book.title}</li>`;
    ul.insertAdjacentHTML('beforeend', bookHtml);
}

function renderBooks(books) {
    books.forEach(book => renderBook(book));
}

function fetchBooks() {
    fetch(baseUrl)
    .then(resp => resp.json())
    .then(books => renderBooks(books))
}

function renderUsers(book) {
    let userHtml = ``
    book.users.forEach (function(user) {
        userHtml += `<li><b>${user.username}</b></li>`
    })
    return userHtml
}

function addUserLike(event) {
    console.log('like', event.target)
}

function renderDetails(book) {
    console.log(book);
    show.innerHTML = `
        <h1>${book.title}</h1>
        <img src=${book.img_url}>
        <p>${book.description}</p>
        <ul id='user-list'>${renderUsers(book)}</ul>
        <button class='like-button' id='${book.id}'>Like</button>
        `
    // let likeBtn = document.getElementById(`like-${book.id}`)
    // debugger;
}

function fetchBook(id) {
    fetch(baseUrl + `/${id}`)
    .then(resp => resp.json())
    .then(book => renderDetails(book))
}

function showBook(event) {
    const target = event.target;
    if (target.tagName === 'LI') {
        fetchBook(target.id);
    }
}

function likeFetch(book) {
    const userData = {
        'users': []
    }

    let liked = false;

    // debugger;
    book.users.forEach(user => {
        // debugger;
        let userObj = {
            'id': user.id,
            'username': user.username
        }
        // debugger;
        
        if (Object.values(userObj).includes('pouros')) {
            liked = true;
        } else {
            userData['users'].push(userObj)   
        }
        
             
    })

    if (!liked) {
        userData['users'].push({'id': 1, 'username': 'pouros'})
    }


    
    // console.log(userData)

    patchObj = { 
        method: 'PATCH',
        headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        body: JSON.stringify(userData)
    }

    fetch(baseUrl + `/${book.id}`, patchObj)
    .then(resp => resp.json())
    .then(book => {
        console.log('quack quack', book)
        let ul = document.querySelector('#user-list')
        // debugger;
        ul.innerHTML = renderUsers(book)
    })
}

function userFetch(id) {
    console.log(id);

    fetch(baseUrl + `/${id}`)
    .then(resp => resp.json())
    .then(book => likeFetch(book))

}

function main() {
    document.addEventListener("DOMContentLoaded", function() {
        fetchBooks();
        ul.addEventListener('click', function(event) {
            showBook(event);

        });

        show.addEventListener('click', function(event) {
            if (event.target.className === 'like-button') {
               userFetch(event.target.id);
            }
            
        })
    });
}

main();