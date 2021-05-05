// ----------------------------------- Importing the necessary modules

// Express
const express = require('express');
// Express file reader
const expressFormData = require('express-form-data');
// Dotenv
require('dotenv').config();
// Mongoose
const mongoose = require('mongoose');
// Cloudinary (image upload)
const cloudinary = require('cloudinary');
// User routes, redirects any http://myapp.com/user requests
const usersRoutes = require('./routes/user');
// Product routes, redirects any http://myapp.com/product requests
const productRoutes = require('./routes/products');

// ----------------------------------- Necessary configurations and declarations

// Create server
const server = express();
// Configure server to be able to read body of packets
server.use(express.urlencoded({ extended: false }));
// Configure server to read json data
server.use(express.json());
// Configure server to read form data, or files
server.use(expressFormData.parse());

// MongoDB connection string
const connectionString = process.env.DB_CONNECTION_STRING;
// Connection configuration for mongoose
const connectionConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
// Mongoose configuration to connect it to MongoDB
mongoose
.connect(connectionString, connectionConfig)
.then(
    () => {
        console.log('connected to database');
    }
)
.catch(
    (error) => {
        console.log('database error', error);
    }
);

// Cloudinary configurations
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);

// ----------------------------------- Main server routes

// Landing page
server.get(
    '/',
    (req, res) => {
        res.send('<h1>Welcome home!</h1>');
    }
);
// Ensuring proper user redirection 
server.use(
    '/user',
    usersRoutes
);
// Ensuring proper products redirection
server.use(
    '/product',
    productRoutes
);

// ----------------------------------- Server listening

// Allowing flexibility in port choice, or default 3001
server.listen(
    process.env.PORT || 3001,
    () => {
        console.log('connected to http://localhost:3001');
    }
);