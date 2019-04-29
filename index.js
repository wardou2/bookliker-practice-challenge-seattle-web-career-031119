document.addEventListener("DOMContentLoaded", function() {
  const booksURL = 'http://localhost:3000/books'

  function loadBooks() {
    fetch(booksURL)
    .then(ret =>  ret.json())
    .then(json => displayBooks(json))
  }

  function displayBooks(books) {
    books.forEach(book => {
      addBook(book)
    })
  }

  function addBook(book) {
    const booksList = document.getElementById('list')
    const newBook = document.createElement('li')
    newBook.textContent = book.title

    newBook.addEventListener('click', () => {
      showBookInfo(book)
    })

    booksList.appendChild(newBook)
  }

  function showBookInfo(book) {
    const showPanel = document.getElementById('show-panel')

    while (showPanel.firstChild) {
      showPanel.removeChild(showPanel.firstChild)
    }

    const bookTitle = document.createElement('h2')
    bookTitle.textContent = book.title

    const bookImg = document.createElement('img')
    bookImg.src = book.img_url

    const bookDesc = document.createElement('p')
    bookDesc.textContent = book.description

    let bookUsersUl = document.createElement('ul')
    addUsersList(book.users, bookUsersUl)

    const bookLikeButton  = document.createElement('button')
    if (book.users.some(user => user.id === 1)) {
      bookLikeButton.textContent = 'Unike'
    } else {
      bookLikeButton.textContent = 'Like'
    }

    bookLikeButton.addEventListener('click', () => {
      handleLike(book, bookLikeButton)
      .then(json => {
        addUsersList(json.users, bookUsersUl)
      })
    })

    showPanel.appendChild(bookTitle)
    showPanel.appendChild(bookImg)
    showPanel.appendChild(bookDesc)
    showPanel.appendChild(bookLikeButton)
    showPanel.appendChild(bookUsersUl)
  }

  function handleLike(book, bookLikeButton) {
    let bookUsers = book.users
    
    // find if user exists in like list, some returns true if so
    if (bookUsers.some(user => user.id === 1)) {
      // map over bookUsers to extract an array of all user ids, then find the
      // first index where the user id matches. This case we're only looking for 1
      let index = bookUsers.map(function(user) {return user.id}).indexOf(1)

      if (index > -1) {
        bookUsers.splice(index, 1)
      }
      bookLikeButton.textContent = 'Like'
    } else {
      bookUsers.push({"id": 1, "username": "pouros"})
      bookLikeButton.textContent = 'Unlike'
    }

    return fetch(booksURL + '/' + book.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        users: bookUsers
      })
    })
    .then(ret => ret.json())
  }

  function addUsersList(users, bookUsersUl) {
    while (bookUsersUl.firstChild) {
      bookUsersUl.firstChild.remove()
    }

    users.forEach(user => {
      let userLi = document.createElement('li')
      userLi.textContent = user.username
      bookUsersUl.appendChild(userLi)
    })
  }

  function main() {
    loadBooks()
  }

  main()

});
