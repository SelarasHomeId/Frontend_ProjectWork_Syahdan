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
  const [editingTitle, setEditingTitle] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [sortPopupOpen, setSortPopupOpen] = useState(false);
  const [lastOpenedPopup, setLastOpenedPopup] = useState(null);
  const [sortBy, setSortBy] = useState("");

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

  const handleEditTitle = (cardId, title) => {
    setEditingTitle(cardId);
    setTitleValue(title);
  };

  const handleSaveTitle = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, title: titleValue } : card
      )
    );
    setEditingTitle(null);
  };

  const toggleDropdown = (cardId) => {
    setDropdownOpen(dropdownOpen === cardId ? null : cardId);
  };

  const toggleSortPopup = () => {
    // Toggle the sort pop-up only if it wasn't previously open
    if (lastOpenedPopup !== "sort") {
      setSortPopupOpen(true);
      setLastOpenedPopup("sort");
    } else {
      setSortPopupOpen(!sortPopupOpen);
    }
  };

  const closeSortPopup = () => {
    setSortPopupOpen(false);
    setLastOpenedPopup(null);
  };

  const handleSortOptionClick = (option) => {
    setSortBy(option);
    closeSortPopup(); // Close the sort popup when an option is selected
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="workspace-container">
        <div className="cards-container">
          {cards.map((card) => (
            <Droppable key={card.id} droppableId={card.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="card">
                  <div className="card-header">
                    {editingTitle === card.id ? (
                      <input
                        type="text"
                        className="title-edit-input"
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        onBlur={() => handleSaveTitle(card.id)}
                        autoFocus
                      />
                    ) : (
                      <h3 onClick={() => handleEditTitle(card.id, card.title)}>{card.title}</h3>
                    )}
                    <button className="dropdown-button" onClick={() => toggleDropdown(card.id)}>
                      ⋮
                    </button>
                    {dropdownOpen === card.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => addTask(card.id)}>Add Task</button>
                        <button>Copy List</button>
                        <button>Move List</button>
                        <button>Move All Cards</button>
                        <button onClick={toggleSortPopup}>Sort By</button>
                      </div>
                    )}
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
                              >
                                {task}
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

        {sortPopupOpen && (
          <div className="sort-popup">
            <h4>Sort By</h4>
            <button onClick={() => handleSortOptionClick("Date Created (Newest First)")}>
              Date Created (Newest First)
            </button>
            <button onClick={() => handleSortOptionClick("Date Created (Oldest First)")}>
              Date Created (Oldest First)
            </button>
            <button onClick={() => handleSortOptionClick("Card Name (Alphabetically)")}>
              Card Name (Alphabetically)
            </button>
            <button onClick={() => handleSortOptionClick("Due Date")}>Due Date</button>
            <button onClick={closeSortPopup}>Close</button>
          </div>
        )}

        {sortBy && (
          <div className="sort-popup">
            <h4>Sorting By: {sortBy}</h4>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default Workspace;
