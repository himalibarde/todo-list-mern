# 📝 MERN To-Do List Application

A full-stack **To-Do List application** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
This app helps users manage daily tasks efficiently with features like deadlines, priorities, categories, task status, and overdue tracking.

# 🚀 Features

➕ Add new tasks with:
  - Task name
  - Deadline (date & time)
  - Priority (Low / Medium / High)
  - Category (Personal, College, Work, etc.)

✏️ Edit existing tasks

❌ Delete tasks

✅ Mark tasks as Completed or Pending

🔍 Search tasks by name

🎯 Filter tasks (All / Pending / Completed)

⚠️ Automatically highlights **Overdue tasks**

📊 Dashboard with task statistics:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks

🎨 Modern and responsive UI using **React Bootstrap & CSS**

# 🛠️ Tech Stack

# Frontend
- React.js
- Bootstrap & React-Bootstrap
- CSS
  
# Backend
- Node.js
- Express.js

# Database 
- MongoDB

# 📂 Project Structure

```text
Todo-List/
│
├── backend/
│   ├── models/
│   │   └── todoList.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Todo.js
│   │   │   └── Todo.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

# ⚙️ Installation & Setup (Local)

1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/todo-list-mern.git
cd todo-list-mern

2️⃣ Backend Setup -
cd backend
npm install
npm start

Backend will run on:
http://localhost:3001

3️⃣ Frontend Setup - 
cd frontend
npm install
npm start

Frontend will run on:
http://localhost:3000

🌐 API Endpoints - 

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    |  /getTodoList         | Fetch all tasks |
| POST   |  /addTodoList`        | Add a new task  |
| POST   |  /updateTodoList/:id  | Update a task   |
| DELETE |  /deleteTodoList/:id  | Delete a task   |

📸 UI Highlights -
-Gradient-based modern design
-Responsive layout (Mobile & Desktop)
-Visual indicators for priority & overdue tasks
-Clean and user-friendly dashboard

🔮 Future Enhancements

-User authentication (Login / Signup)
-Dark mode
-Notifications for deadlines
-Drag & drop task ordering
-Cloud deployment (Render + Vercel)
