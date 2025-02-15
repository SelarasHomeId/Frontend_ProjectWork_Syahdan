import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Workspace.css"; // Import CSS tambahan

const initialCards = [
  { id: "marketing", title: "Marketing", tasks: ["Task 1", "Task 2"] },
  { id: "legal", title: "Legal", tasks: ["Task 3", "Task 4"] },
  { id: "accounting", title: "Accounting", tasks: ["Task 5"] },
  { id: "technical", title: "Technical", tasks: ["Task 6", "Task 7"] },
];

const Workspace = () => {
  const [cards, setCards] = useState(initialCards);
  const [editingTask, setEditingTask] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Fungsi untuk menangani pergerakan task
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceIndex = cards.findIndex((c) => c.id === source.droppableId);
    const destinationIndex = cards.findIndex((c) => c.id === destination.droppableId);

    const sourceTasks = [...cards[sourceIndex].tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const destinationTasks = [...cards[destinationIndex].tasks];
    destinationTasks.splice(destination.index, 0, movedTask);

    const updatedCards = [...cards];
    updatedCards[sourceIndex].tasks = sourceTasks;
    updatedCards[destinationIndex].tasks = destinationTasks;

    setCards(updatedCards);
  };

  const addTask = (cardId) => {
    const newTask = prompt("Enter new task:");
    if (newTask) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, tasks: [...card.tasks, newTask] } : card
        )
      );
    }
  };

  const handleEditTask = (cardId, index) => {
    setEditingTask({ cardId, index });
    setEditValue(cards.find((card) => card.id === cardId).tasks[index]);
  };

  const handleSaveTask = (cardId, index) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              tasks: card.tasks.map((task, i) => (i === index ? editValue : task)),
            }
          : card
      )
    );
    setEditingTask(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="workspace-container">
        <div className="cards-container">
          {cards.map((card) => (
            <Droppable key={card.id} droppableId={card.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="card"
                >
                  <div className="card-header">
                    <h3>{card.title}</h3>
                  </div>
                  <div className="card-body">
                    <div className="task-list">
                      {card.tasks.length > 0 ? (
                        card.tasks.map((task, index) => (
                          <Draggable key={task} draggableId={task} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="task"
                                onDoubleClick={() => handleEditTask(card.id, index)}
                              >
                                {editingTask?.cardId === card.id && editingTask.index === index ? (
                                  <input
                                    type="text"
                                    className="task-edit-input"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => handleSaveTask(card.id, index)}
                                    autoFocus
                                  />
                                ) : (
                                  task
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="no-task">No tasks</p>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="add-task-btn" onClick={() => addTask(card.id)}>
                      + Add Task
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default Workspace;
