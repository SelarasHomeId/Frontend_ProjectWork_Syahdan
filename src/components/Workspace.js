import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Workspace.css";

const Workspace = () => {
  const [boards, setBoards] = useState([
    { id: "marketing", title: "Marketing", tasks: ["Task 1", "Task 2"] },
    { id: "legal", title: "Legal", tasks: ["Task 3", "Task 4"] },
    { id: "accounting", title: "Accounting", tasks: ["Task 5"] },
    { id: "technical", title: "Technical", tasks: ["Task 6", "Task 7"] },
  ]);

  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingCard, setDraggingCard] = useState(null);
  const [highlightedCard, setHighlightedCard] = useState(null);

  const taskAnimation = {
    initial: { opacity: 0, y: -10, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.3 } },
    whileDrag: { scale: 1.1, opacity: 0.8 },
  };

  const boardAnimation = {
    layout: true,
    transition: { duration: 0.3, type: "spring" },
    whileDrag: { scale: 0.95, opacity: 0.7 },
  };

  const handleDragStart = (e, task, boardId) => {
    setDraggingTask({ task, from: boardId });
    console.log(draggingTask);
    e.dataTransfer.setData("task", JSON.stringify({ task, from: boardId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropTask = (e, boardId) => {
    e.preventDefault();
    setHighlightedCard(null);

    const draggedTask = JSON.parse(e.dataTransfer.getData("task"));
    if (!draggedTask) return;

    const { task, from } = draggedTask;
    if (from !== boardId) {
      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board.id === from) {
            return { ...board, tasks: board.tasks.filter((t) => t !== task) };
          }
          if (board.id === boardId) {
            return { ...board, tasks: [...board.tasks, task] };
          }
          return board;
        })
      );
    }
    setDraggingTask(null);
  };

  const handleCardDragStart = (e, index) => {
    setDraggingCard(index);
    e.dataTransfer.setData("type", "board");
  };

  const handleCardDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggingCard === null || e.dataTransfer.getData("type") !== "board") return;

    setBoards((prevBoards) => {
      if (draggingCard === targetIndex) return prevBoards;

      const updatedBoards = [...prevBoards];
      [updatedBoards[draggingCard], updatedBoards[targetIndex]] = [updatedBoards[targetIndex], updatedBoards[draggingCard]];

      return updatedBoards;
    });
    setDraggingCard(null);
  };

  const handleAddBoard = () => {
    const newBoard = {
      id: `board-${boards.length + 1}`,
      title: `New Board ${boards.length + 1}`,
      tasks: [],
    };
    setBoards([...boards, newBoard]);
  };

  const handleAddTask = (boardId) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? { ...board, tasks: [...board.tasks, `Task ${board.tasks.length + 1}`] }
          : board
      )
    );
  };

  return (
    <div className="workspace-container">
      <h2>Workspace</h2>
      <div className="cards-container">
        {boards.map((board, index) => (
          <motion.div
            key={board.id}
            className={`card ${highlightedCard === board.id ? "highlight" : ""}`}
            draggable="true"
            onDragStart={(e) => handleCardDragStart(e, index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleCardDrop(e, index)}
            {...boardAnimation}
          >
            <div className="card-header">
              <h3>{board.title}</h3>
            </div>
            <div
              className="card-body task-list"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropTask(e, board.id)}
            >
              <AnimatePresence>
                {board.tasks.map((task, index) => (
                  <motion.div
                    key={index}
                    className="task"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, task, board.id)}
                    {...taskAnimation}
                  >
                    {task}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="card-footer">
              <button className="btn btn-secondary" onClick={() => handleAddTask(board.id)}>
                + Add Task
              </button>
            </div>
          </motion.div>
        ))}
        <button className="btn btn-primary add-board-button" onClick={handleAddBoard}>
          + Add Another List
        </button>
      </div>
    </div>
  );
};

export default Workspace;
