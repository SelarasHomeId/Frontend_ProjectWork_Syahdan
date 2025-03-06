import React, { useState } from "react";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Workspace.css";

const ItemTypes = {
  TASK: "task",
};

const Workspace = () => {
  const [boards, setBoards] = useState([
    { id: "marketing", title: "Marketing", tasks: ["Task 1", "Task 2"] },
    { id: "legal", title: "Legal", tasks: ["Task 3", "Task 4"] },
    { id: "accounting", title: "Accounting", tasks: ["Task 5"] },
    { id: "technical", title: "Technical", tasks: ["Task 6", "Task 7"] },
  ]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isAddingBoard, setIsAddingBoard] = useState(false);

  const addBoard = () => {
    if (newBoardTitle.trim()) {
      const newBoard = {
        id: `board-${Date.now()}`,
        title: newBoardTitle,
        tasks: [],
      };
      setBoards([...boards, newBoard]);
      setNewBoardTitle("");
      setIsAddingBoard(false);
    }
  };

  const moveTask = (task, fromBoardId, toBoardId, toIndex) => {
    if (fromBoardId === toBoardId && toIndex === undefined) return;

    setBoards((prevBoards) => {
      let taskToMove;
      const updatedBoards = prevBoards.map((board) => {
        if (board.id === fromBoardId) {
          taskToMove = board.tasks.find((t) => t === task);
          return { ...board, tasks: board.tasks.filter((t) => t !== task) };
        }
        return board;
      });

      return updatedBoards.map((board) => {
        if (board.id === toBoardId && taskToMove) {
          const newTasks = [...board.tasks];
          newTasks.splice(toIndex, 0, taskToMove);
          return { ...board, tasks: newTasks };
        }
        return board;
      });
    });
  };

  const addTask = (boardId, task) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, tasks: [...board.tasks, task] } : board
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="workspace-container">
        <div className="cards-container">
          {boards.map((board) => (
            <Board key={board.id} board={board} moveTask={moveTask} addTask={addTask} />
          ))}
          <div className="add-board-container">
            {isAddingBoard ? (
              <div className="board-input-container">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter board title"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addBoard()}
                />
                <button className="btn btn-success btn-sm mt-2" onClick={addBoard}>
                  Add Board
                </button>
              </div>
            ) : (
              <button className="btn btn-success btn-add-board" onClick={() => setIsAddingBoard(true)}>
                + Add Board
              </button>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

const Board = ({ board, moveTask, addTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(board.id, newTask);
      setNewTask("");
      setIsAdding(false);
    }
  };

  return (
    <motion.div className="card board-card" style={{ minHeight: 100 + board.tasks.length * 30 }}>
      <div className="card-header">
        <h3>{board.title}</h3>
      </div>
      <div className="card-body">
        <AnimatePresence>
          {board.tasks.map((task, i) => (
            <Task key={task} task={task} boardId={board.id} index={i} moveTask={moveTask} />
          ))}
        </AnimatePresence>
        {isAdding && (
          <div className="task-input-container">
            <input
              type="text"
              className="form-control"
              placeholder="Enter task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button className="btn btn-success btn-sm mt-2" onClick={handleAddTask}>
              Add
            </button>
          </div>
        )}
      </div>
      <div className="card-footer d-flex justify-content-start">
        <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
          + Add Task
        </button>
      </div>
    </motion.div>
  );
};

const Task = ({ task, boardId, index, moveTask }) => {
  const [, ref] = useDrag({
    type: ItemTypes.TASK,
    item: { task, boardId, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (draggedItem) => {
      if (draggedItem.task !== task) {
        moveTask(draggedItem.task, draggedItem.boardId, boardId, index);
        draggedItem.index = index;
        draggedItem.boardId = boardId;
      }
    },
  });

  return (
    <motion.div ref={(node) => ref(drop(node))} className="task">
      {task}
    </motion.div>
  );
};

Board.propTypes = {
  board: PropTypes.object.isRequired,
  moveTask: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
};

Task.propTypes = {
  task: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  moveTask: PropTypes.func.isRequired,
};

export default Workspace;