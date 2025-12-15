import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Badge } from "react-bootstrap";
import "./Todo.css";

function Todo() {
  // Input fields
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("Pending");
  const [deadline, setDeadline] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");

  // Todo list from database
  const [todoList, setTodoList] = useState([]);
  
  // UI states
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Backend URL
  const BASE_URL = "http://localhost:3001";

  // Fetch all todos
  const getTodos = () => {
    axios.get(`${BASE_URL}/getTodoList`)
      .then(res => setTodoList(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Add todo
  const addTodo = () => {
    if (task === "" || deadlineDate === "" || deadlineTime === "") {
      alert("Please fill all fields including date and time");
      return;
    }

    // Combine date and time
    const combinedDeadline = `${deadlineDate}T${deadlineTime}`;

    axios.post(`${BASE_URL}/addTodoList`, {
      task,
      status,
      deadline: combinedDeadline,
      priority,
      category
    })
    .then(() => {
      getTodos();
      resetForm();
    })
    .catch(err => console.log(err));
  };

  // Update todo
  const updateTodo = () => {
    if (!editingTodo) return;

    // Combine date and time if both are present
    const combinedDeadline = deadlineDate && deadlineTime ? `${deadlineDate}T${deadlineTime}` : deadline;

    axios.post(`${BASE_URL}/updateTodoList/${editingTodo._id}`, {
      task,
      status,
      deadline: combinedDeadline,
      priority,
      category
    })
    .then(() => {
      getTodos();
      resetForm();
      setShowModal(false);
      setEditingTodo(null);
    })
    .catch(err => console.log(err));
  };

  // Delete todo
  const deleteTodo = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete(`${BASE_URL}/deleteTodoList/${id}`)
        .then(() => getTodos())
        .catch(err => console.log(err));
    }
  };

  // Toggle completion
  const toggleComplete = (todo) => {
    const newStatus = todo.status === "Completed" ? "Pending" : "Completed";
    axios.post(`${BASE_URL}/updateTodoList/${todo._id}`, {
      status: newStatus
    })
    .then(() => getTodos())
    .catch(err => console.log(err));
  };

  // Open edit modal
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setTask(todo.task);
    setStatus(todo.status);
    // Split datetime into date and time
    if (todo.deadline) {
      const date = new Date(todo.deadline);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setDeadlineDate(`${year}-${month}-${day}`);
      setDeadlineTime(`${hours}:${minutes}`);
      setDeadline(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
    setPriority(todo.priority || "Medium");
    setCategory(todo.category || "Personal");
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setTask("");
    setStatus("Pending");
    setDeadline("");
    setDeadlineDate("");
    setDeadlineTime("");
    setPriority("Medium");
    setCategory("Personal");
  };

  // Filter and search todos
  const getFilteredTodos = () => {
    let filtered = todoList;

    // Filter by status
    if (filter !== "All") {
      filtered = filtered.filter(todo => todo.status === filter);
    }

    // Search by task name
    if (searchTerm) {
      filtered = filtered.filter(todo => 
        todo.task.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "danger";
      case "Medium": return "warning";
      case "Low": return "info";
      default: return "secondary";
    }
  };

  // Check if task is overdue
  const isOverdue = (deadline, status) => {
    if (status === "Completed") return false;
    const today = new Date();
    const dueDate = new Date(deadline);
    return dueDate < today;
  };

  // Get stats
  const stats = {
    total: todoList.length,
    completed: todoList.filter(t => t.status === "Completed").length,
    pending: todoList.filter(t => t.status === "Pending").length,
    overdue: todoList.filter(t => isOverdue(t.deadline, t.status)).length
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="todo-container">
      {/* Header */}
      <div className="todo-header">
        <h1 className="todo-title">
          <i className="bi bi-check2-circle"></i> My To-Do List
        </h1>
        <p className="todo-subtitle">Organize your tasks efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card stat-overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-number">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="add-todo-section">
        <h3 className="section-title">Add New Task</h3>
        <Form className="todo-form">
          <div className="form-row-1">
            <Form.Group className="form-group-task">
              <Form.Control
                type="text"
                placeholder="What needs to be done?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="task-input"
              />
            </Form.Group>

            <Form.Group className="form-group-priority">
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="form-row-2">
            <Form.Group className="form-group-category">
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                <option value="Personal">Personal</option>
                <option value="College">College</option>
                <option value="Work">Work</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="form-group-datetime">
              <div className="datetime-combined">
                <div className="date-wrapper">
                  <Form.Control
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="date-only-input"
                  />
                </div>
                <div className="time-wrapper">
                  <Form.Control
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    className="time-only-input"
                  />
                </div>
              </div>
            </Form.Group>

            <Button onClick={addTodo} className="add-btn">
              <i className="bi bi-plus-circle"></i> Add Task
            </Button>
          </div>
        </Form>
      </div>

      {/* Filter and Search */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === "Pending" ? "active" : ""}`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === "Completed" ? "active" : ""}`}
            onClick={() => setFilter("Completed")}
          >
            Completed
          </button>
        </div>

        <div className="search-box">
          <i className="bi bi-search search-icon"></i>
          <Form.Control
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Todo List */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks found</h3>
            <p>Add a new task to get started!</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div 
              key={todo._id} 
              className={`todo-item ${todo.status === "Completed" ? "completed" : ""} ${isOverdue(todo.deadline, todo.status) ? "overdue" : ""}`}
            >
              <div className="todo-checkbox">
                <input
                  type="checkbox"
                  checked={todo.status === "Completed"}
                  onChange={() => toggleComplete(todo)}
                  id={`todo-${todo._id}`}
                />
                <label htmlFor={`todo-${todo._id}`}></label>
              </div>

              <div className="todo-content">
                <div className="todo-task">{todo.task}</div>
                <div className="todo-meta">
                  <Badge bg={getPriorityColor(todo.priority || "Medium")} className="priority-badge">
                    {todo.priority || "Medium"}
                  </Badge>
                  <span className="category-badge">
                    {todo.category || "Personal"}
                  </span>
                  <span className="deadline-badge">
                    <i className="bi bi-calendar"></i> {new Date(todo.deadline).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  {isOverdue(todo.deadline, todo.status) && (
                    <span className="overdue-badge">Overdue!</span>
                  )}
                </div>
              </div>

              <div className="todo-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => openEditModal(todo)}
                  title="Edit"
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                  title="Delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingTodo(null);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task</Form.Label>
              <Form.Control
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Personal">Personal</option>
                <option value="College">College</option>
                <option value="Work">Work</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            setEditingTodo(null);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Todo;