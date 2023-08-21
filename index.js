const express = require('express');
const app = express();
const port = 8080 || process.env.port;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./routes/user.route'));

//mongoos connection
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/task_project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Listen for connection events
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB server');
});

// Listen for disconnection events
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB server');
});

// Listen for termination events
process.on('SIGINT', () => {
    db.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});

// mongodb://localhost:27017


app.listen(port, () => {
    console.log('Server is running on port:' + port);
});