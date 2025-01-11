const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
        
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
        
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get ISBN from the route parameter
    const review = req.query.review; // Get review from query parameters
    const username = req.session.authorization?.username; // Get username from session

    // Validate input
    if (!review) {
        return res.status(400).json({ message: "Review content is missing." });
    }
    if (!username) {
        return res.status(403).json({ message: "User not logged in." });
    }

    // Check if the book exists
    let book = books[isbn];
    if (book) {
        // Ensure reviews exist for the book
        if (!book.reviews) {
            book.reviews = {};
        }

        // Add or update the user's review
        book.reviews[username] = review;

        return res.status(200).json({ 
            message: "Review added/updated successfully.",
            reviews: book.reviews
        });
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const username = req.session.authorization?.username; // Get the username from session

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    // Check if the review exists for the user
    if (books[isbn].reviews[username]) {
        // Delete the review
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        // No review found for the user
        return res.status(404).json({ message: "No review found for this user on the specified book" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
