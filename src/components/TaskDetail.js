import React, { useState, useRef, useCallback } from "react";
import {
  X, Eye, Users, Tag, CheckSquare, Calendar, Paperclip, Image, Grid
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

const TaskDetail = ({ task, onClose, onDelete }) => {
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const fileInputRef = useRef(null);

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

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        name: file.name,
        comments: [],
        showDropdown: false,
      }))
    ]);
    setAttachmentMessage("Attachment has been uploaded.");
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

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const toggleDropdown = (index) => {
    setAttachments((prev) =>
      prev.map((att, idx) =>
        idx === index ? { ...att, showDropdown: !att.showDropdown } : att
      )
    );
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

  return (
    <div className="modal-overlay">
      <div className="modal-container wider">
        <div className="modal-content">

          <div className="check-circle-wrapper">
            <div
              className={`check-circle ${isCompleted ? "checked" : ""}`}
              onClick={() => setIsCompleted(!isCompleted)}
            >
              {isCompleted && "✓"}
            </div>
            {isCompleted && <div className="popup-text">Completed</div>}
          </div>

          <button className="close-btn" onClick={onClose}><X size={24} /></button>

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

          <button className={`watch-btn ${isWatched ? 'watching' : ''}`} onClick={() => setIsWatched(!isWatched)}>
            <Eye size={16} className="icon" /> {isWatched ? 'Watching' : 'Watch'}
          </button>

          <h3 className="section-title">Description</h3>
          <div className="description-wrapper">
            <div className="description-box">
              <div className="toolbar">
                {toolbarButtons.map((btn, idx) => (
                  <button key={idx} onClick={btn.action}>{btn.label}</button>
                ))}
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {attachmentMessage && (
            <div className="attachment-section">
              <h3 className="section-title">Attachment</h3>
              <p>{attachmentMessage}</p>
              <ul className="attachment-list">
                {attachments.map((attachment, index) => (
                  <li key={index} className="attachment-item">
                    <div className="attachment-info">
                      <span>{attachment.name}</span>
                      <button className="dropdown-btn" onClick={() => toggleDropdown(index)}>...</button>
                      {attachment.showDropdown && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleFileDownload(attachment.file)}>Download</button>
                          <button onClick={() => handleFileDelete(index)}>Delete</button>
                          <button onClick={() => {
                            const newName = prompt("Enter new file name:", attachment.name);
                            if (newName) handleEditFileName(index, newName);
                          }}>Edit Name</button>
                          <textarea
                            placeholder="Add a comment..."
                            value={attachmentComments[index] || ""}
                            onChange={(e) => handleFileCommentChange(index, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
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
            <button onClick={handleAddComment} className="add-comment-btn">Add</button>
          </div>

          <div className="activity-list">
            {activity.map((act, index) => (
              <div key={index} className="activity-item">
                <div className="avatar">YS</div>
                <p className="activity-text">
                  <span className="activity-user">{act.user}</span> {act.text} <br />
                  <span className="activity-time">{act.timestamp}</span>
                </p>
              </div>
            ))}
          </div>

          {showDatePicker && (
            <div className="date-picker-section">
              <h3 className="section-title">Select a Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate && (
                <p className="selected-date">Selected Date: {selectedDate}</p>
              )}
            </div>
          )}
        </div>

        <div className="sidebar">
  {[ 
    { icon: Users, label: "Members" },
    { icon: Tag, label: "Labels" },
    { icon: CheckSquare, label: "Checklist", action: () => setShowChecklist(true) },
    { icon: Calendar, label: "Dates", action: () => setShowDatePicker((prev) => !prev) },
    { icon: Paperclip, label: "Attachment", action: triggerFileUpload },
    { icon: Image, label: "Cover" },
    { icon: Grid, label: "Delete Task", action: () => setShowDeleteConfirm(true) }
  ].map(({ icon: Icon, label, action }, idx) => (
    <button key={idx} className="sidebar-btn" onClick={action || (() => alert(`${label} clicked!`))}>
      <Icon size={16} className="icon" /> {label}
      {label === "Attachment" && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      )}
    </button>
  ))}
</div>

      </div>

      {showDeleteConfirm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Are you sure you want to delete this task?</h3>
            <div className="popup-buttons">
              <button className="popup-btn confirm" onClick={() => {
                onDelete?.(task.id);
                onClose();
              }}>
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
