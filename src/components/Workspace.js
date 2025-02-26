import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Workspace.css";

const ItemType = { TASK: "task", BOARD: "board" };

const Workspace = () => {
  const [boards, setBoards] = useState([
    { id: "marketing", title: "Marketing", tasks: ["Task 1", "Task 2"], isAddingTask: false },
    { id: "legal", title: "Legal", tasks: ["Task 3", "Task 4"], isAddingTask: false },
    { id: "accounting", title: "Accounting", tasks: ["Task 5"], isAddingTask: false },
    { id: "technical", title: "Technical", tasks: ["Task 6", "Task 7"], isAddingTask: false },
  ]);

  const moveBoard = useCallback((dragIndex, hoverIndex) => {
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      const [movedBoard] = newBoards.splice(dragIndex, 1);
      newBoards.splice(hoverIndex, 0, movedBoard);
      return newBoards;
    });
  }, []);

  const moveTask = (task, fromBoardId, toBoardId) => {
    if (fromBoardId === toBoardId) return;
    setBoards((prevBoards) => {
      const newBoards = prevBoards.map((board) => {
        if (board.id === fromBoardId) {
          return { ...board, tasks: board.tasks.filter((t) => t !== task) };
        }
        if (board.id === toBoardId) {
          return { ...board, tasks: [...board.tasks, task] };
        }
        return board;
      });
      return newBoards;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="workspace-container">
        <div className="cards-container">
          {boards.map((board, index) => (
            <Board key={board.id} index={index} board={board} moveBoard={moveBoard} moveTask={moveTask} setBoards={setBoards} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

const Board = ({ board, index, moveBoard, moveTask, setBoards }) => {
  const ref = useRef(null);
  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.BOARD,
    hover: (draggedBoard) => {
      if (draggedBoard.index !== index) {
        moveBoard(draggedBoard.index, index);
        draggedBoard.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.BOARD,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  const [, dropTask] = useDrop({
    accept: ItemType.TASK,
    drop: (draggedTask) => moveTask(draggedTask.task, draggedTask.boardId, board.id),
  });

  const addTask = () => {
    setBoards((prevBoards) => prevBoards.map((b) => (b.id === board.id ? { ...b, isAddingTask: true } : b)));
  };

  const saveTask = useCallback(
    (isEsc = false) => {
      if (newTask.trim() && !isEsc) {
        setBoards((prevBoards) =>
          prevBoards.map((b) => (b.id === board.id ? { ...b, tasks: [...b.tasks, newTask], isAddingTask: false } : b))
        );
      }
      setNewTask("");
      setBoards((prevBoards) =>
        prevBoards.map((b) => (b.id === board.id ? { ...b, isAddingTask: false } : b))
      );
    },
    [newTask, setBoards, board.id]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        saveTask();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        saveTask(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [saveTask]);

  return (
    <div ref={(node) => dropTask(ref.current = node)} className="card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="card-header">
        <h3>{board.title}</h3>
      </div>
      <div className="card-body">
        <AnimatePresence>
          {board.tasks.map((task, i) => (
            <Task key={i} task={task} boardId={board.id} />
          ))}
        </AnimatePresence>
        {board.isAddingTask && (
          <input
            ref={inputRef}
            type="text"
            className="form-control mt-2"
            placeholder="Type a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveTask()}
            autoFocus
          />
        )}
      </div>
      <div className="card-footer">
        <button className="btn btn-secondary" onClick={addTask}>
          + Add Task
        </button>
      </div>
    </div>
  );
};

const Task = ({ task, boardId }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { task, boardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <motion.div ref={ref} className="task" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {task}
    </motion.div>
  );
};

Board.propTypes = {
  board: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  moveBoard: PropTypes.func.isRequired,
  moveTask: PropTypes.func.isRequired,
  setBoards: PropTypes.func.isRequired,
};

Task.propTypes = {
  task: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
};

export default Workspace;
