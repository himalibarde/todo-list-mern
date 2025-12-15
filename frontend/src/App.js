import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from "./components/Todo";

function App() {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4"><b>Plan ▪ Execute ▪ Complete</b></h2>
      <Todo />
    </div>
  );
}

export default App;
