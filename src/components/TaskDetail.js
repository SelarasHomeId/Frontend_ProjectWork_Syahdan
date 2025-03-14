import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/TaskDetail.css";
import { X } from "lucide-react";

const TaskDetail = ({ task, onClose }) => {
  useEffect(() => {
    console.log(task);
  },[task])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()} // Biar modal gak ketutup kalau klik dalam modal
      >
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>{task.title}</h2>
        <p>Task ID: {task.id}</p>
      </motion.div>
    </div>
  );
};

export default TaskDetail;
