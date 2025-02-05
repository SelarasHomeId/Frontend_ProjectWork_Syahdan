import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Workspace.css"; // Import CSS tambahan

const cardsData = [
  { id: 1, title: "Marketing", tasks: ["Task 1", "Task 2"] },
  { id: 2, title: "Legal", tasks: ["Task 3", "Task 4"] },
  { id: 3, title: "Accounting", tasks: ["Task 5"] },
  { id: 4, title: "Technical", tasks: ["Task 6", "Task 7"] },
];

const Workspace = () => {
  const [tasks, setTasks] = useState(cardsData);

  const addTask = (cardId) => {
    const newTask = prompt("Enter new task:");
    if (newTask) {
      setTasks((prevTasks) =>
        prevTasks.map((card) =>
          card.id === cardId ? { ...card, tasks: [...card.tasks, newTask] } : card
        )
      );
    }
  };

  return (
    <div className="workspace-container">
      <div className="cards-container">
        {tasks.map((card) => (
          <div key={card.id} className="card">
            <div className="card-header">
              <h3>{card.title}</h3>
            </div>
            <div className="card-body">
              <div className="task-list">
                {card.tasks.length > 0 ? (
                  card.tasks.map((task, index) => (
                    <div key={index} className="task">{task}</div>
                  ))
                ) : (
                  <p className="no-task">No tasks</p>
                )}
              </div>
            </div>
            <div className="card-footer">
              <button className="add-task-btn" onClick={() => addTask(card.id)}>
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workspace;
