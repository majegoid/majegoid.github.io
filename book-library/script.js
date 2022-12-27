// DOCUMENT QUERIES
// NAVBAR
const navCreateBookButton = document.querySelector('button.button-green');
// MAIN
const booksDisplayContainer = document.querySelector('main');
// MODAL
const modalClickBg = document.querySelector('div.modal-click-bg');
const createBookModal = document.querySelector('.modal');
// FORM
const createBookModalForm = document.querySelector('form#create-book-modal-form');
const bookTitleInput = document.querySelector('input#book-title');
const bookAuthorInput = document.querySelector('input#book-author');
const bookPagesInput = document.querySelector('input#book-pages');
const bookHasBeenReadCheckbox = document.querySelector('input#book-read');
const createBookButton = document.querySelector('button#create-book-button');
const createBookModalFormTextInputs = Array.from(
  document.querySelectorAll('#create-book-modal-form input[type="text"]')
);
// END DOCUMENT QUERIES

// DATA STRUCTURES
function Book(title = 'Unknown Title', author = 'Unknown Author', pages = 1, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = () =>
    `${this.title} by ${this.author}, ${this.pages} pages, ${read ? 'read' : 'not read yet'}`;
  this.toggleBookReadStatus = () => {
    this.read = !this.read;
    displayBooks();
  };
}
// END DATA STRUCTURES

// GLOBAL STATE
let myLibrary = [new Book(1), new Book(2), new Book(3), new Book(4), new Book(5), new Book(6)];
// END GLOBAL STATE

// SET UP DOM
modalClickBg.style.display = 'none';

modalClickBg.onclick = () => {
  toggleCreateBookModalDisplay();
  resetForm();
};
navCreateBookButton.onclick = toggleCreateBookModalDisplay;
createBookModal.onclick = (e) => e.stopPropagation();

// Validate form again when submitted.
createBookModalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let isFormInvalid = checkInputs();
  if (isFormInvalid) return;
  let bookData = Object.fromEntries(new FormData(createBookModalForm).entries());
  addBookToLibrary(bookData);
  toggleCreateBookModalDisplay();
});

// Validate every input when any input is changed.
createBookModalFormTextInputs.forEach((input) => input.addEventListener('input', checkInputs));
// END SET UP DOM

// DOM MANIPULATION FUNCTIONS
function addBookToLibrary(bookData) {
  let newBook = new Book(...Object.values(bookData));
  myLibrary.push(newBook);
  myLibrary.sort((a, b) => a.title - b.title);
  displayBooks();
}

function removeBookFromLibrary(book) {
  myLibrary = myLibrary.filter((b) => b !== book);
  displayBooks();
}

function displayBooks() {
  booksDisplayContainer.replaceChildren();
  myLibrary
    .sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;

      if (a.author > b.author) return 1;
      if (a.author < b.author) return -1;

      if (a.pages > b.pages) return 1;
      if (a.pages < b.pages) return -1;

      if (a.read > b.read) return 1;
      if (a.read < b.read) return -1;
    })
    .map((book) => createCardElem(book))
    .forEach((card) => booksDisplayContainer.appendChild(card));
}

function createCardElem(book) {
  // <div class='card'>
  //   <h3>"Book Title"</h3>
  //   <p>by Book Author</p>
  //   <p>Page Count: 999</p>
  //   <p>Finished Reading: True</p>
  //   <button>Delete</button>
  // </div>;

  let cardElem = document.createElement('div');
  let titleElem = document.createElement('h3');
  let authorElem = document.createElement('p');
  let pagesElem = document.createElement('p');
  let readElem = document.createElement('p');
  let buttonContainer = document.createElement('div');
  let toggleReadStatusButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  cardElem.setAttribute('class', 'card');
  titleElem.textContent = `"${book.title}"`;
  authorElem.textContent = `by ${book.author}`;
  pagesElem.textContent = `Pages: ${book.pages}`;
  readElem.textContent = `Finished Reading: ${book.read}`;
  toggleReadStatusButton.textContent = 'Toggle Read';
  toggleReadStatusButton.classList.add('button-blue');
  toggleReadStatusButton.onclick = book.toggleBookReadStatus;
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('button-red');
  deleteButton.style.float = 'right';
  deleteButton.onclick = () => removeBookFromLibrary(book);

  cardElem.appendChild(titleElem);
  cardElem.appendChild(authorElem);
  cardElem.appendChild(pagesElem);
  cardElem.appendChild(readElem);
  cardElem.appendChild(buttonContainer);

  buttonContainer.appendChild(toggleReadStatusButton);
  buttonContainer.appendChild(deleteButton);

  return cardElem;
}

function toggleCreateBookModalDisplay() {
  if (modalClickBg.style.display === 'none') {
    modalClickBg.style.display = 'block';
  } else {
    modalClickBg.style.display = 'none';
  }
}

function resetForm() {
  createBookModalForm.reset();
  createBookModalFormTextInputs.forEach((inputElem) => setFormControlDefault(inputElem));
}
// END DOM MANIPULATION FUNCTIONS

// CLASS MANIPULATION FUNCTIONS
// Sets a form-control div's validation state to the default
function setFormControlDefault(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control';
  const small = formControl.querySelector('small');
  small.innerText = '';
}

// Sets a form-control div's class to show the error state and the error message text.
function setFormControlError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = formControl.querySelector('small');
  small.innerText = message;
}

// Sets a form-control div's class to show the success state.
function setFormControlSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}
// END ELEMENT CLASS MANIPULATION FUNCTIONS

function checkInputs() {
  let validationError = false;
  // Trim all values, set them as const values so they can't be reassigned.
  const bookTitleValue = bookTitleInput.value.trim();
  const bookAuthorValue = bookAuthorInput.value.trim();
  const bookPagesValue = bookPagesInput.value.trim();

  // Validate Book Title
  if (bookTitleValue === '') {
    setFormControlError(bookTitleInput, `Book Title can't be blank.`);
    validationError = true;
  } else {
    setFormControlSuccess(bookTitleInput);
  }

  // Validate Book Author
  if (bookAuthorValue === '') {
    setFormControlError(bookAuthorInput, `Book Author can't be blank.`);
    validationError = true;
  } else {
    setFormControlSuccess(bookAuthorInput);
  }

  // Validate Book Pages
  if (bookPagesValue === '') {
    setFormControlError(bookPagesInput, `Book Pages can't be blank.`);
    validationError = true;
  } else if (Number.isNaN(+bookPagesValue)) {
    setFormControlError(bookPagesInput, `Book Pages value must be a number.`);
    validationError = true;
  } else if (+bookPagesValue <= 0) {
    setFormControlError(bookPagesInput, `Book Pages can't be less than or equal to 0.`);
    validationError = true;
  } else {
    setFormControlSuccess(bookPagesInput);
  }
  return validationError;
}

displayBooks();
