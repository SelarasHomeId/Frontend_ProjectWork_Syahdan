import React, { useState, useRef } from "react";
import {
  X, Eye, Users, Tag, CheckSquare, Paperclip, Image, Grid
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import "../styles/TaskDetail.css";
import { Move } from 'lucide-react';


const TaskDetail = ({ task, onClose, onDelete }) => {
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  //const [percentage, setPercentage] = useState(0);

  const [comment, setComment] = useState("");
  const [activity, setActivity] = useState(task.activity || []);
  const [isWatched, setIsWatched] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [attachmentMessage, setAttachmentMessage] = useState("");
  const [attachmentComments, setAttachmentComments] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
  const fileInputAttachmentRef = useRef(null);
  const fileInputCoverRef = useRef(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');



  const [coverImage, setCoverImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems((prev) => [
        ...prev,
        { text: newChecklistItem, checked: false }
      ]);
      setNewChecklistItem("");
    }
  };

  const toggleChecklistItem = (index) => {
    setChecklistItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const editor = useEditor({
    extensions: [StarterKit, ImageExtension, Bold, Italic, Heading, ListItem, BulletList, OrderedList],
    content: task.description || "",
    onUpdate: ({ editor }) => {
      console.log("Description updated:", editor.getHTML());
    },
  });

  const handleAddComment = () => {
    if (comment.trim()) {
      const newActivity = [...activity, {
        user: "Yusnar Setiyadi",
        text: comment,
        timestamp: new Date().toLocaleString()
      }];
      setActivity(newActivity);
      setComment("");
    }
  };

  const handleFileDownload = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileDelete = (index) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleEditFileName = (index, newName) => {
    if (!newName.trim()) return;
    setAttachments((prev) => {
      const updated = [...prev];
      updated[index].name = newName;
      return updated;
    });
  };

  const handleFileCommentChange = (index, newComment) => {
    setAttachmentComments((prev) => {
      const updated = [...prev];
      updated[index] = newComment;
      return updated;
    });
  };

  const triggerFileUpload = () => {
    fileInputAttachmentRef.current?.click();
  };
  

  const handleAttachmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newAttachment = {
        name: file.name,
        file: file,
        showDropdown: false,
      };
      setAttachments((prev) => [...prev, newAttachment]);
      setAttachmentMessage("Uploaded files:");
    }
  };  

  const toggleDropdown = (index) => {
    // Update attachmentMessage
    setAttachmentMessage("file uploaded");
  
    // Update attachments state dengan showDropdown
    setAttachments((prev) =>
      prev.map((att, idx) =>
        idx === index ? { ...att, showDropdown: !att.showDropdown } : att
      )
    );
  
    // Toggle dropdown untuk file yang sesuai dengan index
    setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
  };

  const toolbarButtons = [
    { label: "B", action: () => editor?.chain().focus().toggleBold().run() },
    { label: "I", action: () => editor?.chain().focus().toggleItalic().run() },
    { label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "• List", action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "1. List", action: () => editor?.chain().focus().toggleOrderedList().run() },
    {
      label: "🖼", action: () =>
        editor?.chain().focus().setImage({ src: "https://via.placeholder.com/150" }).run()
    }
  ];

  // Fungsi untuk menghapus file
  // const handleRemoveFile = (index) => {
  //   const updatedAttachments = attachments.filter((_, i) => i !== index);
  //   setAttachments(updatedAttachments);
  // };

  const handleMoveTask = (taskId, targetListId) => {
    // logika untuk memindahkan task ke list lain
    console.log(`Pindahkan task ${taskId} ke list ${targetListId}`);
    // Lanjutkan sesuai kebutuhan
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container d-flex"
        style={{ gap: "1rem", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal-content flex-grow-1">
          {coverImage && (
            <div className="cover-image-container">
              <img src={coverImage} alt="Cover" className="cover-image" />
            </div>
          )}

          <div className="check-circle-wrapper">
            <div
              className={`check-circle ${isCompleted ? "checked" : ""}`}
              onClick={() => setIsCompleted(!isCompleted)}
            >
              {isCompleted && "✓"}
            </div>
            {isCompleted && <div className="popup-text">Completed</div>}
          </div>

          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>

          {isEditingTitle ? (
            <input
              type="text"
              className="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingTitle(false);
              }}
              autoFocus
            />
          ) : (
            <h2 className="modal-title" onClick={() => setIsEditingTitle(true)}>
              {title}
            </h2>
          )}

          <button
            className={`watch-btn ${isWatched ? "watching" : ""}`}
            onClick={() => setIsWatched(!isWatched)}
          >
            <Eye size={16} className="icon" /> {isWatched ? "Watching" : "Watch"}
          </button>

          <h3 className="section-title">Description</h3>
          <div className="description-wrapper">
            <div className="description-box">
              <div className="toolbar">
                {toolbarButtons.map((btn, idx) => (
                  <button key={idx} onClick={btn.action}>
                    {btn.label}
                  </button>
                ))}
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {showChecklist && (
            <div className="checklist-section">
              <h3 className="section-title">Checklist</h3>
              <div className="checklist-input">
                <input
                  type="text"
                  placeholder="Add new item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                />
                <button onClick={handleAddChecklistItem}>Add</button>
              </div>
              <ul className="checklist-list">
                {checklistItems.map((item, index) => (
                  <li key={index} className="checklist-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(index)}
                      />
                      {item.text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {attachmentMessage && (
            <div className="attachment-section">
              <h3 className="section-title">Attachment</h3>
              <p>{attachmentMessage}</p>

              {attachments.length > 0 && (
                <ul className="attachment-list">
                  {attachments.map((attachment, index) => (
                    <li key={index} className="attachment-item">
                      <div className="attachment-info">
                        <span>{attachment.name}</span>
                        <button className="dropdown-btn" onClick={() => toggleDropdown(index)}>
                          ...
                        </button>

                        {attachment.showDropdown && (
                          <div className="dropdown-menu">
                            <button onClick={() => handleFileDownload(attachment.file)}>Download</button>
                            <button onClick={() => handleFileDelete(index)}>Delete</button>
                            <button onClick={() => {
                              const newName = prompt("Enter new file name:", attachment.name);
                              if (newName?.trim()) handleEditFileName(index, newName.trim());
                            }}>
                              Edit Name
                            </button>
                            <textarea
                              placeholder="Add a comment..."
                              value={attachmentComments[index] || ""}
                              onChange={(e) => handleFileCommentChange(index, e.target.value)}
                              className="attachment-comment"
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="*/*"
                onChange={handleAttachmentUpload}
                style={{ display: "none" }}
              />
              <button onClick={triggerFileUpload}>Upload File</button>
            </div>
          )}

          <h3 className="section-title">Activity</h3>
          <div className="comment-wrapper">
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleAddComment} className="add-comment-btn">
              Add
            </button>
          </div>

          <div className="activity-list">
            {activity.map((act, index) => (
              <div key={index} className="activity-item">
                <div className="avatar">
                  {act.user.split(" ").map((word) => word[0]).join("").toUpperCase()}
                </div>
                <p className="activity-text">
                  <span className="activity-user">{act.user}</span> {act.text} <br />
                  <span className="activity-time">{act.timestamp}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="sidebar d-flex flex-column"
          style={{ width: "200px", flexShrink: 0, gap: "0.5rem" }}
        >
          {[
            { icon: Users, label: "Members" },
            { icon: Tag, label: "Labels" },
            { icon: CheckSquare, label: "Checklist", action: () => setShowChecklist(true) },
            { icon: Paperclip, label: "Attachment", action: () => fileInputAttachmentRef.current?.click() },
            { icon: Image, label: "Cover", action: () => fileInputCoverRef.current?.click() },
            { icon: Grid, label: "Delete Task", action: () => setShowDeleteConfirm(true) },
            { icon: Move, label: "Move", action: () => setShowMoveModal(true) },
          ].map(({ icon: Icon, label, action }, idx) => (
            <button
              key={idx}
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={action || (() => alert(`${label} clicked!`))}
              type="button"
            >
              <Icon size={16} className="icon" /> {label}

              {label === "Cover" && (
                <input
                  ref={fileInputCoverRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  style={{ display: "none" }}
                />
              )}

              {label === "Attachment" && (
                <input
                  ref={fileInputAttachmentRef}
                  type="file"
                  accept="*/*"
                  onChange={handleAttachmentUpload}
                  style={{ display: "none" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {showMoveModal && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Move Task</h3>
            <div className="popup-section">
              <label>Choose Workspace:</label>
              <select value={selectedWorkspace} onChange={(e) => setSelectedWorkspace(e.target.value)}>
                <option value="">Select Workspace</option>
                <option value="workspace-1">Workspace 1</option>
                <option value="workspace-2">Workspace 2</option>
              </select>
            </div>
            <div className="popup-section">
              <label>Choose Board:</label>
              <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)}>
                <option value="">Select Board</option>
                <option value="board-1">Board 1</option>
                <option value="board-2">Board 2</option>
              </select>
            </div>
            <div className="popup-buttons">
              <button className="popup-btn confirm" onClick={handleMoveTask}>
                Move
              </button>
              <button className="popup-btn cancel" onClick={() => setShowMoveModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Are you sure you want to delete this task?</h3>
            <div className="popup-buttons">
              <button
                className="popup-btn confirm"
                onClick={() => {
                  onDelete?.(task.id);
                  onClose();
                }}
              >
                Yes, Delete
              </button>
              <button className="popup-btn cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
