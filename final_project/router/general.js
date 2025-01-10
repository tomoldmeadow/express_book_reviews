const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        
        if (isValid(username)) {
            
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    
    return res.status(404).json({message: "Username or Password have not been entered."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Obtain all keys for books object
    author = req.params.author;

    // Filter books based on author
    const booksByAuthor = Object.keys(books)
        .map(key => books[key]) // Convert keys to book objects
        .filter(book => book.author === author); // Check if author matches

    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor); // Return matching books
    } else {
        res.status(404).json({ message: `No books found for author: ${author}` }); // Author not found
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Obtain all keys for books object
    title = req.params.title;

    // Filter books based on title
    const booksByTitle = Object.keys(books)
        .map(key => books[key]) // Convert keys to book objects
        .filter(book => book.title === title); // Check if title matches

    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle); // Return matching books
    } else {
        res.status(404).json({ message: `No books found with this title: ${title}` }); // Title not found
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    const book = books[ISBN]
    res.send(books[1]["reviews"])
});

module.exports.general = public_users;
