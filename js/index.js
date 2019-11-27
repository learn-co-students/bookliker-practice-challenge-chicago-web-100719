const ulEl = document.querySelector('#list')


function renderBookShow(book){
  const showPanel = document.querySelector('#show-panel')
  showPanel.innerHTML = `<h2>${book.title}</h2><img src="${book.img_url}"><p>${book.description}</p>`

  book.users.forEach(function(user){
    showPanel.insertAdjacentHTML('beforeend', `<p><b>${user.username}</b></p>`)
  })

 const readButton = document.createElement('button')
 readButton.dataset.id = book.id
 readButton.innerText = 'Read Book'
 showPanel.appendChild(readButton)
 addReadBtnListener(readButton, book)
}

function addReadBtnListener(readButton, book){
  readButton.addEventListener('click', function() {
    if (!book.users.map(user => user.id).includes(1)){
      book.users.push({id: 1, username:'pouros'})
      console.log(book.users)
      const reqObj = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          users: book.users
        })
      }
      fetch(`http://localhost:3001/books/${book.id}`, reqObj)
      .then(resp => resp.json())
      .then(book => renderBookShow(book))
    }
    else {
      alert("You've read this already!")
    }
  })
}


function fetchSingleBook(bookID) {
  fetch(`http://localhost:3001/books/${bookID}`)
  .then(resp => resp.json())
  .then(book => renderBookShow(book))
}


function addBookListener(){
  ulEl.addEventListener('click', function(){
    fetchSingleBook(event.target.dataset.id)
  })
}

function fetchBooks(){
  fetch('http://localhost:3001/books')
  .then(resp => resp.json())
  .then(books => renderBooks(books))
}


function renderBooks(books) {
  books.forEach(book => renderBook(book))
}


function renderBook(book){
  const liEl = document.createElement('li')
  liEl.innerText = book.title
  liEl.dataset.id = book.id
  ulEl.appendChild(liEl)
}


function main(){
  document.addEventListener('DOMContentLoaded', function(){
    fetchBooks()
    addBookListener()
  })
}

main()

