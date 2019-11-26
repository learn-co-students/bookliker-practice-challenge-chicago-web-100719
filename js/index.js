const booksUrl = 'http://localhost:3000/books'
const usersUrl = 'http://localhost:3000/users'
const showPanel = document.getElementById('show-panel')
const list = document.getElementById('list')

//main
document.addEventListener("DOMContentLoaded", function() {
  fetchBooks()

  list.addEventListener('click', function(event) {
    let bookId = event.target.id
    fetch(`${booksUrl}/${bookId}`)
    .then(resp => resp.json())
    .then(book => renderBook(book))
  })

  showPanel.addEventListener('click', function(event) {
    if (event.target.id === 'button')
      fetch(`${booksUrl}/${event.target.dataset.id}`)
        .then(resp => resp.json())
        .then(book => addLiker(book))
  })
});

//fetching books functions
function fetchBooks() {
  fetch(booksUrl)
  .then(resp => resp.json())
  .then(books => listBooks(books))
}

function listBooks(books) {
  books.forEach(book => listBook(book))
}

function listBook(book) {
  const li = document.createElement('li')
  li.innerText = book.title
  li.setAttribute('id', `${book.id}`)
  list.appendChild(li)
}

//rendering books functions
function renderBook(book) {
  const users = book.users
  showPanel.innerHTML = `<img src=${book.img_url}>
                        <p>${book.description}</p>
                        <ul id="users-list"></ul>
                        <button data-id=${book.id} id="button">LIKE!</button>`
  users.forEach(user => listUser(user))
}

function listUser(user) {
  const usersList = document.getElementById('users-list')
  const userLi = document.createElement('li')
  userLi.innerText = user.username
  usersList.appendChild(userLi)
}

//updating user list functions
function addLiker(book) {
  const allUsers = book.users
  const bookId = book.id
  allUsers.push({"id": 1, "username": "pouros"})

  let objConfig = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ "users": allUsers})
  }

    fetch(`${booksUrl}/${bookId}`, objConfig)
    .then(resp => resp.json())
    .then(book => listUser(book.users[book.users.length-1]))
}
