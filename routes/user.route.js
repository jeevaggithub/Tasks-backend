const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const TaskList = require('../models/TaskList'); // Import the TaskList model
const Task = require('../models/task'); // Adjust the path as needed
const UserTask = require('../models/userTask'); // Adjust the path as needed



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
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Array of task IDs
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

//taskSchema
// const taskSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String },
//     dueDate: { type: Date },
//     // Other task-related fields...
// });
// //model for Task schema
// const Task = mongoose.model('Task', taskSchema);


// const userTaskSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     taskId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Task',
//     },
//     title: String,
//     description: String,
//     dueDate: Date,
// });

// const UserTask = mongoose.model('UserTask', userTaskSchema);

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


// Route to create a new task and associate it with a user
// app.post('/tasks', async (req, res) => {
//     try {
//         const { userId, title, description, dueDate } = req.body;

//         // Find the user by userId
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Create a new task
//         const newTask = new Task({
//             title,
//             description,
//             dueDate: new Date(dueDate),
//             // Other task fields...
//         });

//         // Save the task
//         const savedTask = await newTask.save();

//         // Create a UserTask relationship
//         const userTaskData = {
//             userId,
//             taskId: savedTask._id,
//             title: savedTask.title,
//             description: savedTask.description,
//             dueDate: savedTask.dueDate,
//         };

//         const UserTask = new UserTask(userTaskData);

//         // Save the userTask relationship
//         await UserTask.save();

//         console.log('New task:', UserTask);

//         res.status(201).json({ message: 'Task created and associated with user', task: savedTask });
//     } catch (error) {
//         console.error('Error creating task:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// app.post('/tasks', async (req, res) => {
//     try {
//         const { userId, title, description, dueDate } = req.body;

//         // Find the user by userId
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if user has a task list named 'favorite', if not, create it
//         let favoriteTaskList = await TaskList.findOne({ userId, title: 'favorite' });
//         if (!favoriteTaskList) {
//             favoriteTaskList = new TaskList({ userId, title: 'favorite' });
//             await favoriteTaskList.save();
//         }

//         // Create a new task
//         const newTask = new Task({
//             title,
//             description,
//             dueDate: new Date(dueDate),
//             taskListId: favoriteTaskList._id, // Associate the task with the 'favorite' task list
//             isFavorite: false // Default value for isFavorite
//         });

//         // Save the task
//         const savedTask = await newTask.save();

//         // Create a UserTask relationship
//         const userTaskData = {
//             userId,
//             taskId: savedTask._id,
//             title: savedTask.title,
//             description: savedTask.description,
//             dueDate: savedTask.dueDate,
//             isFavorite: savedTask.isFavorite
//         };

//         const newUserTask = new UserTask(userTaskData);

//         // Save the userTask relationship
//         await newUserTask.save();

//         console.log('New task:', newUserTask);

//         res.status(201).json({ message: 'Task created and associated with user', task: savedTask });
//     } catch (error) {
//         console.error('Error creating task:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

app.post('/tasklists', async (req, res) => {
    try {
        const { userId, title } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new task list
        const newTaskList = new TaskList({
            userId,
            title,
            tasks: [] // Initialize tasks as an empty array
        });

        // Save the task list
        const savedTaskList = await newTaskList.save();

        console.log('New task list:', savedTaskList);

        res.status(201).json({ message: 'Task list created and associated with user', taskList: savedTaskList });
    } catch (error) {
        console.error('Error creating task list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const { userId, taskListId, title, description, dueDate } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the task list by taskListId in the tasklists collection
        const taskList = await TaskList.findById(taskListId);
        if (!taskList) {
            return res.status(404).json({ message: 'Task list not found' });
        }

        // Create a new task
        const newTask = new Task({
            title,
            description,
            dueDate: new Date(dueDate),
            taskListId: taskList._id, // Associate the task with the specific task list
            isFavorite: false // Default value for isFavorite
        });

        // Save the task
        const savedTask = await newTask.save();

        console.log('New task:', savedTask);

        // Add the task to the tasks array of the task list
        taskList.tasks.push(savedTask._id);
        await taskList.save();

        res.status(201).json({ message: 'Task created and associated with task list', task: savedTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Fetch user's tasks and task lists
app.get('/user/:userId/tasks', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all TaskList documents for the given userId
        const taskLists = await TaskList.find({ userId });

        // Fetch details of each task list using taskListId references
        const taskListsData = await Promise.all(
            taskLists.map(async (taskList) => {
                const tasks = await Task.find({ taskListId: taskList._id });
                return {
                    title: taskList.title,
                    _id: taskList._id,
                    tasks: tasks
                };
            })
        );

        // Find the favorite task list
        const favoriteTaskList = taskListsData.find(list => list.title === 'favorite');

        if (!favoriteTaskList) {
            taskListsData.unshift({ title: 'favorite', tasks: [] });
        } else {
            favoriteTaskList.tasks = favoriteTaskList.tasks.filter(task => task.isFavorite);
        }

        res.status(200).json(taskListsData);
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Create a route to delete a task list
// Create a route to delete a task list
app.delete('/deletelist/:userId/:taskListId', async (req, res) => {
    try {
        const { userId, taskListId } = req.params;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the task list using deleteOne
        const result = await TaskList.deleteOne({ _id: taskListId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Task list not found' });
        }

        console.log('Deleted task list:', taskListId);

        res.status(200).json({ message: 'Task list deleted', taskListId });
    } catch (error) {
        console.error('Error deleting task list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Group tasks by task list title
function groupTasksByTaskList(tasks) {
    const taskLists = {};
    tasks.forEach(task => {
        if (!taskLists[task.taskList]) {
            taskLists[task.taskList] = [];
        }
        taskLists[task.taskList].push({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate
        });
    });

    return Object.keys(taskLists).map(title => ({
        title,
        tasks: taskLists[title]
    }));
}


module.exports = app
