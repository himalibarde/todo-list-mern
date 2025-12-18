const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require("./models/todoList");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Health check
app.get("/", (req, res) => {
  res.send("Todo Backend is running");
});

// Get all todos
app.get("/getTodoList", (req, res) => {
  TodoModel.find({})
    .then(todoList => res.json(todoList))
    .catch(err => res.json(err));
});

// Add new todo
app.post("/addTodoList", (req, res) => {
  TodoModel.create({
    task: req.body.task,
    status: req.body.status,
    deadline: req.body.deadline,
  })
    .then(todo => res.json(todo))
    .catch(err => res.json(err));
});

// Update todo
app.post("/updateTodoList/:id", (req, res) => {
  const id = req.params.id;
  TodoModel.findByIdAndUpdate(id, {
    task: req.body.task,
    status: req.body.status,
    deadline: req.body.deadline,
  })
    .then(todo => res.json(todo))
    .catch(err => res.json(err));
});

// Delete todo
app.delete("/deleteTodoList/:id", (req, res) => {
  const id = req.params.id;
  TodoModel.findByIdAndDelete(id)
    .then(todo => res.json(todo))
    .catch(err => res.json(err));
});

// PORT for Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
