import React, { useState } from 'react';
import './ToDoList.css'; // Memastikan file CSS yang benar diimpor

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");

    const addTask = () => {
        if (input.trim() !== "") {
            setTasks([...tasks, input]);
            setInput("");
        } else {
            alert("Tugas tidak boleh kosong!");
        }
    };

    const deleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    return (
        <div className="to-do-list">
            <h2>Your To-Do List</h2>
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Tambah tugas baru"
                className="input-task"
            />
            <button onClick={addTask} className="add-task-button">Tambah</button>

            <ul className="task-list">
                {tasks.map((task, index) => (
                    <li key={index} className="task-item">
                        {task}
                        <button onClick={() => deleteTask(index)} className="delete-task-button">
                            Hapus
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDoList;
