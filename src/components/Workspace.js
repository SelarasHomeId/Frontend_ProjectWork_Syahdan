import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Workspace.css";
import Swal from "sweetalert2";
import { createBoard, createTask, deleteBoard, getAllBoardByWorkspaceId, getAllTaskByBoardId, getTaskById, updateBoard, updateTask, workspaceFind } from "../service/apiService";
import { FaCheckSquare, FaClock, FaComment, FaEye, FaFileAlt, FaPaperclip, FaTag  } from "react-icons/fa";
import TaskDetail from "./TaskDetail";
import { decimalToHexColor, getColorFromInitial, getInitials, getContrastingTextColor } from "../utils/general";

const ItemTypes = {
  TASK: "task",
  BOARD: "board",
};

const Workspace = ({ workspaceId, toDetailTask, setToDetailTask }) => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const inputRef = useRef(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  const handleClickTask = async (task) => {
    setIsLoadingTask(true);
    try {
      const responseTask = await getTaskById(task.id);
      if (responseTask.success){
        const taskData = responseTask.data.data;
        if (taskData === null){
          Swal.fire({
            title: "Task not found",
            text: "Silakan hubungi admin anda!",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setSelectedTask(taskData);
        }
      }
    } catch (error) {
      console.error("Error saat mengambil task:", error);
      Swal.fire({
        title: "Terjadi kesalahan",
        text: "Gagal mengambil data task",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoadingTask(false);
    } 
  };

  const handleClose = () => {
    setSelectedTask(null);
    loadBoardsAndTasks(workspaceId);
  };

  useEffect(() => {
    loadBoardsAndTasks(workspaceId);
  }, [workspaceId]);

  useEffect(() => {
    if (isAddingBoard) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isAddingBoard]);

  useEffect(() => {
    if (toDetailTask){
      setSelectedTask(toDetailTask);
      setToDetailTask(null)
    }
  }, [toDetailTask, setToDetailTask])

  const loadBoardsAndTasks = async (workspaceId) => {
    const response = await getAllBoardByWorkspaceId(workspaceId);
    const boardsWithTasks = await Promise.all(
      (response || []).map(async (board) => {
        const taskResponse = await getAllTaskByBoardId(board.id);
        const tasks = (taskResponse || []).map((task) => ({
          id: task.id,
          board_id: task.board_id,
          title: task.title,
          assign_to_user: task.assign_to_user,
          checklist: task.checklist,
          comment: task.comment,
          cover: task.cover,
          description: task.description,
          due_date: task.due_date,
          file: task.file,
          is_completed: task.is_completed,
          label: task.label,
          sort_number: task.sort_number,
          watch: task.watch,
        }));
        return {
          id: board.id, //
          name: board.name, //
          sort_number: board.sort_number, //
          task_total: board.task_total, //
          workspace_id: board.workspace_id, //
          tasks: tasks, // 
        };
      })
    );
    setBoards(boardsWithTasks);
  };

  const loadTasksForBoard = async (boardId) => {
    const taskResponse = await getAllTaskByBoardId(boardId);
    const tasks = (taskResponse || []).map((task) => ({
      id: task.id,
      board_id: task.board_id,
      title: task.title,
      assign_to_user: task.assign_to_user,
      checklist: task.checklist,
      comment: task.comment,
      cover: task.cover,
      description: task.description,
      due_date: task.due_date,
      file: task.file,
      is_completed: task.is_completed,
      label: task.label,
      sort_number: task.sort_number,
      watch: task.watch,
    }));
  
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, tasks } : board
      )
    );
  };  

  const addBoard = async () => {
    if (newBoardTitle.trim()) {
      const response = await createBoard({
        workspace_id: parseInt(workspaceId),
        name: newBoardTitle
      })
      if (response.success) {
        const newBoard = {
          id: response.data.id,
          name: response.data.name,
          sort_number: response.data.sort_number,
          task_total: response.data.task_total,
          workspace_id: response.data.workspace_id,
          tasks: [],
        };
        setBoards([...boards, newBoard]);
        setNewBoardTitle("");
        setIsAddingBoard(false);
      } else {
        Swal.fire({
          title: "Gagal!",
          text: response.error.data.message || "Terjadi kesalahan.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const cancelAddBoard = () => {
    setIsAddingBoard(false);
    setNewBoardTitle("");
  }

  const moveTask = async (task, fromBoardId, toBoardId, toIndex) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
  
      const fromBoard = updatedBoards.find((b) => b.id === fromBoardId);
      const toBoard = updatedBoards.find((b) => b.id === toBoardId);
  
      const movedTaskIndex = fromBoard.tasks.findIndex((t) => t.id === task.id);
      const [movedTask] = fromBoard.tasks.splice(movedTaskIndex, 1);
  
      if (fromBoardId === toBoardId) {
        fromBoard.tasks.splice(toIndex, 0, movedTask);
        fromBoard.tasks = fromBoard.tasks.map((t, i) => ({
          ...t,
          sort_number: i + 1,
        }));
      } else {
        toBoard.tasks.splice(toIndex, 0, movedTask);
        toBoard.tasks = toBoard.tasks.map((t, i) => ({
          ...t,
          board_id: toBoardId,
          sort_number: i + 1,
        }));
        fromBoard.tasks = fromBoard.tasks.map((t, i) => ({
          ...t,
          sort_number: i + 1,
        }));
      }
  
      return updatedBoards;
    });
  
    try {
      const affectedBoard = fromBoardId === toBoardId ? [fromBoardId] : [fromBoardId, toBoardId];
      const affectedTasks = boards
        .filter((b) => affectedBoard.includes(b.id))
        .flatMap((b) => b.tasks);
  
      await Promise.all(
        affectedTasks.map((t) =>
          updateTask(t.id, {
            board_id: t.board_id,
            sort_number: t.sort_number,
          })
        )
      );

      await loadTasksForBoard(fromBoardId)
      if (fromBoardId !== toBoardId){
        await loadTasksForBoard(toBoardId)
      }
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const moveBoard = async (dragIndex, hoverIndex) => {
    let newBoards = [];
    setBoards((prevBoards) => {
      let updatedBoards = [...prevBoards];
      const [movedBoard] = updatedBoards.splice(dragIndex, 1);
      updatedBoards.splice(hoverIndex, 0, movedBoard);
      newBoards = updatedBoards.map((board, index) => ({
        ...board,
        sort_number: index + 1,
      }));
  
      return newBoards;
    });
  
    try {
      await Promise.all(
        newBoards.map(({ id, sort_number }) =>
          updateBoard(id, { sort_number })
        )
      );
    } catch (error) {
      console.error("Failed to update board sorting:", error);
    }
  };  

  const addTask = async (boardId, task) => {
    const response = await createTask({
      board_id: boardId,
      title: task
    })
    if (response.success) {
      const responseDetailTask = await getTaskById(response.data.id)
      if (!responseDetailTask.success) {
        Swal.fire({
          title: "Gagal!",
          text: responseDetailTask.error?.message || "Terjadi kesalahan.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      const detailTask = responseDetailTask.data.data
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === boardId ? { ...board, tasks: [...board.tasks, {
            id: detailTask.id, //
            board_id: detailTask.board_id, //
            title: detailTask.title, //
            assign_to_user: detailTask.assign_to_user, //
            checklist: detailTask.checklist.data, //
            comment: detailTask.comment && detailTask.comment.data
              ? detailTask.comment.data.filter((item) => item.is_history === false).length
              : 0,
            cover: detailTask.cover, //
            description: false, //
            due_date: detailTask.due_date, //
            file: detailTask.file.count, //
            is_completed: detailTask.is_completed, //
            label: detailTask.label, //
            sort_number: detailTask.sort_number, //
            watch: detailTask.watch, //
          }] } : board
        )
      );
    } else {
      Swal.fire({
        title: "Gagal!",
        text: response.error.data.message || "Terjadi kesalahan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleRenameBoard = async (board) => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Rename Board",
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <label for="swal-name">Rename:</label>
            <input id="swal-name" type="text" class="swal2-input" placeholder="Input name" value="${board.name}">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Rename",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const newTitle = document.getElementById("swal-name").value;

          const updatedData = {};

          if (newTitle !== board.name) updatedData.name = newTitle;

          if (!newTitle) {
            Swal.showValidationMessage("Nama tidak boleh kosong!");
            return false;
          }
          return updatedData;
        },
      });

      if (formValues && Object.keys(formValues).length > 0) {
        const response = await updateBoard(board.id, formValues);
        if (response.success) {
          await loadBoardsAndTasks(workspaceId);
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error.data.message || "Terjadi kesalahan.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal mengambil data. Mohon coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      const confirmDelete = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Apakah Anda yakin ingin menghapus board ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (confirmDelete.isConfirmed) {
        const response = await deleteBoard(id);

        if (response.success) {
          await loadBoardsAndTasks(workspaceId);
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error.data.message || "Terjadi kesalahan.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal menghapus user. Mohon coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleMoveBoardToWorkspace = async (board) => {
    try {
      const workspaceRes = await workspaceFind();

      const workspaceOptions = workspaceRes.map((workspace) => 
        `<option value="${workspace.id}" ${workspace.id === board.workspace_id ? "selected" : ""}>${workspace.name}</option>`
      ).join("");

      const { value: formValues } = await Swal.fire({
        title: "Move To",
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <select id="swal-workspace" class="swal2-input">
              <option value="" disabled>Select Workspace</option>
              ${workspaceOptions}
            </select>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Move",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const workspace = document.getElementById("swal-workspace").value;
          const updatedData = {};
          if (workspace !== board.workspace_id) updatedData.workspace_id = parseInt(workspace);
          return updatedData;
        },
      });

      if (formValues && Object.keys(formValues).length > 0) {
        const response = await updateBoard(board.id, formValues);
        if (response.success) {
          await loadBoardsAndTasks(workspaceId);
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.error.data.message || "Terjadi kesalahan.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal mengambil data. Mohon coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {isLoadingTask && (
          <div className="loading-overlay">
            <div className="spinner" />
          </div>
      )}
      <div className="workspace-container">
        <div className="cards-container">
        <AnimatePresence>
          {boards.map((board, index) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Board board={board} moveTask={moveTask} moveBoard={moveBoard} addTask={addTask} index={index} renameBoard={handleRenameBoard} deleteBoard={handleDeleteBoard} moveToWorkspace={handleMoveBoardToWorkspace} loadTasksForBoard={loadTasksForBoard} handleClickTask={handleClickTask} />
            </motion.div>
          ))}
        </AnimatePresence>
          <div className="add-board-container">
            {isAddingBoard ? (
              <div className="board-input-container">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control w-50"
                  placeholder="Enter board title"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addBoard()}
                />
                <div className="d-flex gap-2 mt-2 w-50">
                  <button className="btn btn-success btn-sm flex-grow-1" onClick={addBoard}>
                    Add Board
                  </button>
                  <button className="btn btn-danger btn-sm flex-grow-1" onClick={() => cancelAddBoard()}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn btn-primary btn-add-board" onClick={() => setIsAddingBoard(true)}>
                + Add Board
              </button>
            )}
          </div>
        </div>
        {selectedTask && <TaskDetail task={selectedTask} onClose={handleClose}/>}
      </div>
    </DndProvider>
  );
};

const Board = ({ board, moveTask, moveBoard, addTask, index, renameBoard, deleteBoard, moveToWorkspace, loadTasksForBoard, handleClickTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const taskContainerRef = useRef(null);
  const inputRef = useRef(null);
  const moveRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isAdding) {
      taskContainerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isAdding]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (action) => {
    setShowMenu(false);
    if (action === "move") {
      moveToWorkspace(board);
    } else if (action === "rename") {
      renameBoard(board);
    } else if (action === "delete") {
      deleteBoard(board.id);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(board.id, newTask);
      setNewTask("");
      setIsAdding(false);
    }
  };

  const cancelAddTask = () => {
    setIsAdding(false);
    setNewTask("");
  }

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.BOARD,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveBoard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [, dropTask] = useDrop({
    accept: ItemTypes.TASK,
    drop: (draggedItem) => {
      moveTask(draggedItem.task, draggedItem.boardId, board.id, board.tasks.length);
      draggedItem.boardId = board.id;
      draggedItem.index = board.tasks.length;
    },
  });

  drag(drop(moveRef));

  return (
    <motion.div ref={moveRef} className="card board-card" style={{ minHeight: "67vh", maxHeight: "67vh", opacity: isDragging ? 0.5 : 1 }}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="m-0 board-title-workspace">{board.name} <span style={{fontWeight:"normal", fontSize:"16px"}}>({board.task_total})</span></h3>
        <div className="position-relative" ref={menuRef}>
          <button className="btn btn-sm btn-light" onClick={() => setShowMenu(!showMenu)}>
            <i className="bi bi-three-dots fs-6"></i>
          </button>
          {showMenu && (
            <div className="dropdown-menu show position-absolute end-0 mt-2">
              <button className="dropdown-item" onClick={() => handleMenuClick("move")}>Move</button>
              <button className="dropdown-item" onClick={() => handleMenuClick("rename")}>Rename</button>
              <button className="dropdown-item text-danger" onClick={() => handleMenuClick("delete")}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="card-body" ref={dropTask}>
      <AnimatePresence>
        {board.tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <Task task={task} boardId={board.id} index={i} moveTask={moveTask} loadTasksForBoard={loadTasksForBoard} handleClickTask={handleClickTask} />
          </motion.div>
        ))}
      </AnimatePresence>
        {isAdding && (
          <div className="task-input-container" ref={taskContainerRef}>
            <input
              ref={inputRef}
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
            <button className="btn btn-danger btn-sm mt-2 ms-2" onClick={cancelAddTask}>
              Cancel
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

const Task = ({ task, boardId, index, moveTask, loadTasksForBoard, handleClickTask }) => {
  const moveRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { task, boardId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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

  const toggleTask = async (taskId, boardId, is_completed) => {
    await updateTask(taskId, {is_completed: !is_completed})
    await loadTasksForBoard(boardId);
  }

  let isChecklistComplete = false;
  if (task.checklist) {
    const [x, y] = task.checklist.split("/").map(Number);
    isChecklistComplete = x === y;
  }

  const formatDueDate = (due_date) => {
    if (!due_date) return null;
  
    const now = new Date();
    const dueDate = new Date(due_date);
  
    const optionsSameYear = { month: "short", day: "numeric", timeZone: "Asia/Jakarta" };
    const optionsDifferentYear = { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Jakarta" };
  
    const isSameYear = dueDate.getFullYear() === now.getFullYear();
    const formattedDate = new Intl.DateTimeFormat("en-US", isSameYear ? optionsSameYear : optionsDifferentYear).format(dueDate);
  
    let dueClass = "";
    let dueTitle = "has due date active";
    if (task.is_completed) {
      dueClass = "due-completed";
      dueTitle = "the deadline has been completed"
    } else if (dueDate < now) {
      dueClass = "due-overdue";
      dueTitle = "the deadline has passed"
    }
  
    return (

      <span className={`task-due-date ${dueClass}`} title={dueTitle} >
        <FaClock className="task-icon" style={{color: task.is_completed || (dueDate < now) ? "white" : "inherit" }} />
        {formattedDate}
      </span>
    );
  };

  drag(drop(moveRef));

  return (
    <motion.div 
      ref={moveRef} 
      className="task" 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'pointer'
      }}
      title={task.title}
    >
      {task.cover && (
        <img
          src={`${task.cover.view_saved}`} 
          alt={task.cover.name} 
          className="task-cover"
          onClick={() => handleClickTask(task)}
        />
      )}
      <div className="task-content" onClick={() => handleClickTask(task)}>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.is_completed}
          onChange={() => toggleTask(task.id, boardId, task.is_completed)}
          title="Mark to completed"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="task-details">
          {task.label && (
            <div className="task-labels">
              {(task.label.data || []).map((label, idx) => (
                <span 
                  key={idx} 
                  className="task-label"
                >
                  <FaTag className="task-icon" style={{color: decimalToHexColor(label.color)}} title={label.title}/>
                </span>
              ))}
            </div>
          )}
          <span className={task.is_completed ? "task-title completed" : "task-title"}>
            {task.title}
          </span>
          <div className="task-icons">
            {task.watch && <FaEye className="task-icon" title="you've seen this" />}
            {task.description && <FaFileAlt className="task-icon" title="has a description" />}
            {task.file > 0 && (
              <span className="task-attachment" title="has attachments">
                <FaPaperclip className="task-icon" />
                <span className="attachment-count">{task.file}</span>
              </span>
            )}
            {task.comment !== 0 && (
              <span className="task-attachment" title="someone commented this task">
                <FaComment className="task-icon" />
                <span className="attachment-count">{task.comment}</span>
              </span>
            )}
            {task.checklist && (
              <span className="task-checklist" title="has checklist"  style={{ backgroundColor: isChecklistComplete ? "green" : "inherit", padding: "3px", borderRadius: "8px" }}>
                <FaCheckSquare className="task-icon" style={{color: isChecklistComplete ? "white" : "inherit" }} />
                <span className="attachment-count" style={{color: isChecklistComplete ? "white" : "inherit" }}>{task.checklist}</span>
              </span>
            )}
            {formatDueDate(task.due_date)}
          </div>
          {task.assign_to_user && (
            <div className="task-assignees">
              {task.assign_to_user.data.map((user, idx) => {
                const initials = getInitials(user.name);
                const bgColor = getColorFromInitial(initials);
                const textColor = getContrastingTextColor(bgColor);
                return (
                  <div
                    key={idx}
                    className="assignee-circle"
                    style={{ backgroundColor: bgColor,color:textColor }}
                    title={user.name}
                  >
                    {initials}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

Board.propTypes = {
  board: PropTypes.object.isRequired,
  moveTask: PropTypes.func.isRequired,
  moveBoard: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  boardId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  moveTask: PropTypes.func.isRequired,
};

export default Workspace;
