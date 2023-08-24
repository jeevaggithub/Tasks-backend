const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


app.use(cors());


//Token Verification Middleware:

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token missing' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalid' });
        }

        req.userId = decoded.userId;
        next();
    });
}

//define the schema

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
}, { collection: 'users' });

// Create a user model
const User = mongoose.model('User', userSchema);
//define the schema

const userSchemachk = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
}, { collection: 'users' });

// Create a user model
const Userchk = mongoose.model('Userchk', userSchemachk);

app.use(bodyParser.json());


app.post('/signup', async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: 'User is already exist', existingUser });
            // return res.status(401).json({ message: 'user is already exist', existingUser });
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            mobile,
            password,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        // res.json("registered successfuly", savedUser);
        res.status(200).json({ message: 'registered successfuly', savedUser });
    } catch (error) {
        console.error('Error while signing up:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Sign In Route
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email
        const user = await Userchk.findOne({ email });

        if (!user) {
            // If no user is found, return an error response
            res.status(401).json({ message: 'Invalid email' });
        } else {
            // Check if the password matches the one stored in the database
            if (user.password !== password) {
                res.status(401).json({ message: 'Invalid password' });
            } else {
                // If the email and password match, return the user details
                const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
                res.status(200).json({ message: 'user authenticated', token });
                // res.json(user);
            }
        }
    } catch (error) {
        console.error('Error while signing in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// User Route
app.post('/user', verifyToken, async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user with the provided email
        const user = await Userchk.findOne({ email });

        if (!user) {
            // If no user is found, return an error response
            res.status(401).json({ message: 'Invalid email' });
        } else {
            // Check if the password matches the one stored in the database

            res.status(401).json({ User: user });

            // If the email and password match, return the user details
            // res.status(200).json({ message: 'user authenticated' });
            // res.json(user);

        }
    } catch (error) {
        console.error('Error while signing in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = app
