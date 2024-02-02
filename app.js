import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage
let posts = [];  // Stores blog posts
let tasks = [];  // Stores tasks

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// Home route - display posts and tasks
app.get('/', (req, res) => {
    res.render('index', { posts: posts, tasks: tasks });
});

// Route for creating a new post
app.post('/create-post', (req, res) => {
    const post = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    posts.push(post);
    res.redirect('/');
});

// Route for editing a post
app.get('/edit-post/:id', (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id == postId);
    if (post) {
        res.render('edit-post', { post: post });
    } else {
        res.status(404).send('Post not found');
    }
});

// Route for updating a post
app.post('/update-post/:id', (req, res) => {
    const postId = req.params.id;
    let postIndex = posts.findIndex(p => p.id == postId);
    if (postIndex !== -1) {
        posts[postIndex] = {
            ...posts[postIndex],
            title: req.body.title,
            content: req.body.content
        };
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

// Route for deleting a post
app.get('/delete-post/:id', (req, res) => {
    const postId = req.params.id;
    posts = posts.filter(p => p.id != postId);
    res.redirect('/');
});

// Route for creating a new task
app.post('/create-task', (req, res) => {
    const newTask = req.body.task;
    tasks.push(newTask);
    res.redirect('/');
});

// Route for editing a task
app.get('/edit-task/:index', (req, res) => {
    const taskIndex = req.params.index;
    if(taskIndex >= 0 && taskIndex < tasks.length) {
        res.render('edit-task', { task: tasks[taskIndex], index: taskIndex });
    } else {
        res.status(404).send('Task not found');
    }
});

// Route for updating a task
app.post('/update-task/:index', (req, res) => {
    const taskIndex = parseInt(req.params.index, 10);
    if (taskIndex >= 0 && taskIndex < tasks.length) {
        tasks[taskIndex] = req.body.task; // Update the task at the specified index
        res.redirect('/');
    } else {
        res.status(404).send('Task not found');
    }
});

// Route for deleting a task
app.get('/delete-task/:index', (req, res) => {
    const taskIndex = req.params.index;
    if(taskIndex >= 0 && taskIndex < tasks.length) {
        tasks.splice(taskIndex, 1); // Remove the task from the array
    }
    res.redirect('/');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
