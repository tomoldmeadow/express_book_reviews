const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username or password not provided" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// Function to fetch the book list using Promise and async/await
const fetchBooks = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books); // Simulating an Axios call for the book list
        }, 2000); // Delay for 2 seconds
    });
};

// Get the book list available in the shop (using Promises)
public_users.get('/', async (req, res) => {
    console.log("Fetching books...");
    
    try {
        // Await the fetchBooks promise to simulate API call
        const bookList = await fetchBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Function to fetch the book details by ISBN using Promise and async/await
const fetchBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]); 
            } else {
                reject(`No book found with ISBN: ${isbn}`); 
            }
        }, 2000); 
    });
};

// Get book details based on ISBN (using Promise and async/await)
public_users.get('/isbn/:isbn', async function (req, res) {
    const ISBN = req.params.isbn;
    console.log(`Fetching book details for ISBN: ${ISBN}`);

    try {
        // Await the fetchBookByISBN promise
        const bookDetails = await fetchBookByISBN(ISBN);
        res.status(200).json(bookDetails); // Return book details if found
    } catch (error) {
        res.status(404).json({ message: error }); // Return error message if book is not found
    }
});
  
// Function to fetch books by author using Promise and async/await
const fetchBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByAuthor = Object.values(books).filter(
                book => book.author.toLowerCase() === author.toLowerCase()
            );

            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor); 
            } else {
                reject(`No books found for author: ${author}`);
            }
        }, 2000); // Simulate 2 seconds delay
    });
};

// Get book details based on author (using Promise and async/await)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    console.log(`Fetching books for author: ${author}`);

    try {
        // Await the fetchBooksByAuthor promise
        const booksByAuthor = await fetchBooksByAuthor(author);
        res.status(200).json(booksByAuthor); // Return books by the author if found
    } catch (error) {
        res.status(404).json({ message: error }); // Return error message if no books are found
    }
});

// Function to fetch books by title using Promise and async/await
const fetchBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByTitle = Object.values(books).filter(
                book => book.title.toLowerCase() === title.toLowerCase()
            );

            if (booksByTitle.length > 0) {
                resolve(booksByTitle); 
            } else {
                reject(`No books found called: ${title}`);
            }
        }, 2000); // Simulate 2 seconds delay
    });
};

// Get book details based on title (using Promise and async/await)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    console.log(`Fetching books under title: ${title}`);

    try {
        // Await the fetchBooksByTitle promise
        const booksByTitle = await fetchBooksByTitle(title);
        res.status(200).json(booksByTitle); // Return books with title if found
    } catch (error) {
        res.status(404).json({ message: error }); // Return error message if no books are found
    }
});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    const book = books[ISBN];
    if (book) {
        const reviews = book.reviews;
        if (Object.keys(reviews).length > 0) {
            return res.status(200).json({ reviews });
        } else {
            return res.status(200).json({ message: "No reviews available for this book." });
        }
    } else {
        return res.status(404).json({ message: `No book found with ISBN: ${ISBN}` });
    }
});

module.exports.general = public_users;
