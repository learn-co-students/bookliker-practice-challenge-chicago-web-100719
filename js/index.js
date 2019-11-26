const booksLink = 'http://localhost:3000/books'
const booksList = document.getElementById('list')
const showPanel = document.getElementById('show-panel')


document.addEventListener("DOMContentLoaded", function(){
    fetchBooks();
});


function fetchBooks() {
    fetch(booksLink)
    .then(resp => resp.json())
    .then(books => renderBooks(books))
}

function renderBooks(books){
    books.forEach(book => renderBook(book))
}

function renderBook(book) {
    const bookRow = `<li data-id=${book.id}>${book.title} </li>`
    booksList.insertAdjacentHTML('beforeend', bookRow)
}

booksList.addEventListener('click', function(event){
    const bookId = event.target.dataset.id
    fetch(booksLink + `/${bookId}`)
    .then(resp => resp.json())
    .then(book => bookInfo(book))

})

function bookInfo(book) {
    const info = `<img src=${book.img_url}><br><button class="likeBtn" id="${book.id}">LIKE</button><p>Description: ${book.description}</p><ul class="users"><ul></ul>`
    showPanel.innerHTML= info
    renderUsers(book)
}

function renderUsers(book){
    let usersList = document.querySelector('.users')
    book.users.forEach(user => {
        const liUser = document.createElement('li')
        liUser.innerText=`${user.username}`
        usersList.insertAdjacentElement('beforeend', liUser)
    })
}

showPanel.addEventListener('click', function(event){
    if(event.target.className === 'likeBtn') {

        fetch(booksLink + `/${event.target.id}`)
        .then(resp => resp.json())
        .then(book => addUser(book))
    }

    function addUser(book) {
        let userBody = book.users
        const pourosExists = book.users.find(user => user.username === 'pouros')
        if(!pourosExists) {
            userBody.push({'id':1, 'username': 'pouros'})
        }
        const reqObj = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({users: userBody}) 
        }
        fetch(booksLink + `/${event.target.id}`, reqObj)
        .then(resp => resp.json())
        .then(book => {
            let usersList = document.querySelector('.users')
            usersList.innerHTML = ""
            renderUsers(book)
        })
    }      
})