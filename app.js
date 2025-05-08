const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');


// Initialize Express app
const app = express();


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Set EJS as the view engine
app.set('view engine', 'ejs');


// Path to JSON file
const DATA_FILE = path.join(__dirname, 'data.json');


// Helper function to read data from JSON file
function readData() {
 const data = fs.readFileSync(DATA_FILE, 'utf8');
 return JSON.parse(data || '[]');
}


// Helper function to write data to JSON file
function writeData(data) {
 fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}


// Routes


// Home page (display to-do list)
app.get('/', (req, res) => {
 const todos = readData();
 res.render('index', { todos });
});


// Add a new to-do item
app.post('/add', (req, res) => {
 const { task } = req.body;
 if (!task) return res.redirect('/');


 const todos = readData();
 todos.push({ id: Date.now(), task });
 writeData(todos);
 res.redirect('/');
});


// Edit a to-do item (render edit form)
app.get('/edit/:id', (req, res) => {
 const { id } = req.params;
 const todos = readData();
 const todo = todos.find((t) => t.id == id);


 if (!todo) return res.redirect('/');


 res.render('edit', { todo });
});


// Update a to-do item
app.post('/update/:id', (req, res) => {
 const { id } = req.params;
 const { task } = req.body;


 const todos = readData();
 const todo = todos.find((t) => t.id == id);


 if (!todo) return res.redirect('/');


 todo.task = task;
 writeData(todos);
 res.redirect('/');
});


// Delete a to-do item
app.post('/delete/:id', (req, res) => {
 const { id } = req.params;


 const todos = readData();
 const updatedTodos = todos.filter((t) => t.id != id);
 writeData(updatedTodos);
 res.redirect('/');
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});
