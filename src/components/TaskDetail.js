import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Eye, Users, Tag, CheckSquare, Paperclip, Image, 
  Trash,
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
import { getTaskById, updateTask, getLabel, getAllUser } from '../service/apiService';
import "../styles/TaskDetail.css";
import { Move } from 'lucide-react';
import TextAlign from '@tiptap/extension-text-align'
import { FaAlignLeft, FaAlignCenter, FaAlignJustify, FaAlignRight,} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faTag, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { getColorFromInitial, getInitials, getContrastingTextColor } from "../utils/general";
import { debounce } from "lodash";

const TaskDetail = ({ task, onClose, onDelete }) => {
//=====================*USE STATE*===============================//
  //TITLE
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [currentTitle, setCurrentTitle] = useState("");
  //IS COMPLETE
  const [isCompleted, setIsCompleted] = useState(false);
  //IS WATCH
  const [isWatched, setIsWatched] = useState(false);
  //COVER IMAGE
  const [coverImage, setCoverImage] = useState(null);
  const fileInputCoverRef = useRef(null);
  //CHECKLIST
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [percentage, setPercentage] = useState(0);
  // MEMBER
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [currentMember, setCurrentMember] = useState([]);
  const [allMember, setAllMember] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  // LABEL
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labels, setLabels] = useState([]); 
  // const [getLabels, setGetLabels] = useState([]); 
  const [labeled, setCurrentLabeled] = useState([]); 
  // DESCRIPTION
  const [taskData, setTaskData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // DUE DATE
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [dueDate, setDueDate] = useState(''); // menyimpan tanggal

  const toggleDueDateModal = () => {
    setShowDueDateModal(!showDueDateModal);
  };
  const Date = () => <span>📅</span>;
  //ATTACHMENT
  const [attachments, setAttachments] = useState([]);
  const [attachmentMessage, setAttachmentMessage] = useState("");
  const [attachmentComments, setAttachmentComments] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputAttachmentRef = useRef(null);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
  //COMMMENT
  const [comment, setComment] = useState("");
  const [activity, setActivity] = useState(task.activity || []);
  //MOVE
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  
  const fileInputRef = useRef(null);
//======================= *END USE STATE*====================================

//======================= *START FUNCTION*====================================  
const handleCoverImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl);
  }
};

const handleToggleComplete = async () => {
    const next = !isCompleted;
    setIsCompleted(next);
    try {
      await updateTask(task.id, { is_completed: next });
    } catch (e) {
      console.error('Gagal update completed:', e);
      setIsCompleted(!next);
    }
  };

const handleSaveTitle = async () => {
  if(!title.trim()) { // Validasi title tidak boleh kosong
    alert('Judul tidak boleh kosong');
    return;
  }
  
  try {
    await updateTask(task.id, { title: title }, "application/json");
    // Jika perlu refresh data dari server
    const res = await getTaskById(task.id);
    setTaskData(res.data);
    setIsEditingTitle(false);
  } catch (err) {
    console.error('Gagal menyimpan judul:', err);
    alert('Gagal menyimpan judul');
    // Rollback ke nilai sebelumnya jika gagal
    setTitle(currentTitle);
  }
};

const handleToggleWatch = async () => {
    const newWatch = !isWatched;
    setIsWatched(newWatch);

    try {
      await updateTask(task.id, { watch: newWatch });
    } catch (e) {
      console.error('Gagal update watch:', e);
      setIsWatched(!newWatch);
    }
  };

//USER AND MEMBER 
  const debounceSearch = useRef(
  debounce((value, users) => {
    const filtered = value 
      ? users.filter(user => 
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase())
        )
      : users;
    setFilteredUsers(filtered);
  }, 300)
  ).current;

  const handleSearchUserChange = useCallback((value) => {
  setSearchUser(value);
  if (value === '') {
    setFilteredUsers(allUser);
    return;
  }
  debounceSearch(value, allUser);
  }, [allUser, debounceSearch]);

  const handleCheckboxChange = user => {
  setCurrentMember(prev => {
    if (prev.some(m => m.id === user.id)) {
      return prev.filter(m => m.id !== user.id);
    }
    return [...prev, user];
  });
  };

  const handleSaveChanges = async () => {
    const memberIds = currentMember.map(m => m.id);
    try {
      await updateTask(task.id, { assign_to_user: memberIds},"application/json" );
      const res = await getTaskById(task.id);
      setTaskData(res.data.data);
      closeModal();
    } catch (err) {
      console.error('Gagal update task members', err);
      alert('Error updating task');
    }
  };

  const closeModal = useCallback(() => {
    setShowMemberModal(false);
    setSearchUser('');
    setFilteredUsers(allUser);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
  },[allUser, setShowMemberModal]);

// lABEL
  const handleLabelToggle = lbl => {
    setCurrentLabeled(prev => {
      const exists = prev.some(l => l.id === lbl.id);
      if (exists) {
        // hapus label
        return prev.filter(l => l.id !== lbl.id);
      } else {
        // tambah label
        return [...prev, lbl];
      }
    });
  };

  const handleSaveLabels = async () => {
    const labelIds = labeled.map(l => l.id);
    try {
      await updateTask(task.id, { label: labelIds },"application/json");
      // jika perlu refresh task dari server:
      const res = await getTaskById(task.id);
      setTaskData(res.data.data);
      setShowLabelModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal update label');
    }
  };
//CHECKLIST 
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

//DESCRIPTION
  const editor = useEditor({
    extensions: [StarterKit, 
      ImageExtension, 
      Bold, 
      Italic, 
      Heading, 
      ListItem, 
      BulletList, 
      OrderedList,  
      TextAlign.configure({
      types: ['heading', 'paragraph'], 
    }),],
    content: taskData?.description || '',
    onUpdate: ({ editor }) => {
      console.log("Description updated:", editor.getHTML());
    },
  });

  const handleSaveDescription = async () => {
    if (!editor) return;
    const rawHtml = editor.getHTML();
    const isEmpty = editor.state.doc.textContent.trim().length === 0;
    const newDescription = isEmpty ? '' : rawHtml;

    try {
      await updateTask(task.id, { description: newDescription });
      setIsEditing(false);
      const res = await getTaskById(task.id);
      setTaskData(res.data.data);
      editor.commands.setContent(res.data.data.description || '');
    } catch (e) {
      console.error('Gagal menyimpan:', e);
     
    }
  };

//TOOLBAR
  const toolbarButtons = [
    { label: "B", action: () => editor?.chain().focus().toggleBold().run() },
    { label: "I", action: () => editor?.chain().focus().toggleItalic().run() },
    { label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "• List", action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "1. Number", action: () => editor?.chain().focus().toggleOrderedList().run() },
    {
      label: <FaAlignLeft />,
      action: () => editor?.chain().focus().setTextAlign('left').run(),
    },
    {
      label: <FaAlignCenter />,
      action: () => editor?.chain().focus().setTextAlign('center').run(),
    },
    {
      label: <FaAlignRight />,
      action: () => editor?.chain().focus().setTextAlign('right').run(),
    },
    {
      label: <FaAlignJustify />,
      action: () => editor?.chain().focus().setTextAlign('justify').run(),
    },
  ];

  const parseColor = (colorInt) => {
    const color = parseInt(colorInt, 10);
    const red = (color >> 16) & 255;
    const green = (color >> 8) & 255;
    const blue = color & 255;
    return `rgb(${red}, ${green}, ${blue})`;
  };

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
    setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
  };

  const handleMoveTask = (taskId, targetListId) => {
    // logika untuk memindahkan task ke list lain
    console.log(`Pindahkan task ${taskId} ke list ${targetListId}`);
    // Lanjutkan sesuai kebutuhan
  };

  // Handle due date
  const handleDateChange = (e) => {
  setDueDate(e.target.value);
};
const handleSaveDueDate = () => {
  console.log('Due Date disimpan:', dueDate);
  setTaskData((prevTask) => ({
    ...prevTask,
    dueDate: dueDate,
  }));
  setShowDueDateModal(false);
};

//=======================* END FUNCTION*====================================

//=======================*USE EFFECT*======================================//
useEffect(() => {
  if(title !== currentTitle) {
    setCurrentTitle(title);
  }
}, [title, currentTitle]);

useEffect(() => {
  const fetchCompleted = async () => {
    try {
      const res = await getTaskById(task.id);
      setIsCompleted(!!res.data.data.is_completed);
    } catch (e) {
      console.error(e);
    }
  };
  fetchCompleted();
}, [task.id]);

useEffect(() => {
    const fetchWatch = async () => {
      try {
        const res = await getTaskById(task.id);
        setIsWatched(!!res.data.watch);
      } catch (e) {
        console.error('Gagal load watch status:', e);
      }
    };
    fetchWatch();
  }, [task.id]);

// HANDLE TASK
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTaskById(task.id);
        const data = res.data.data;
        setTaskData(data);
        if (editor) {
          editor.commands.setContent(res.data.data.description || '');
        }
        setIsWatched(!!data.watch);
        setIsCompleted(!!data.is_completed);
      } catch (e) {
        console.error('Gagal load task:', e);
      }
    };
    fetchTask();
  }, [task, editor,]);

  useEffect(() => {
    if (!editor) return;
    const onFocus = () => setIsEditing(true);
    editor.on('focus', onFocus);
    return () => {
      editor.off('focus', onFocus);
    };
  }, [editor]);
  //HANDLE LABEL
  useEffect(() => {
    if (!showLabelModal) return;
    getLabel()
      .then(data => {
        setLabels(data);
      })
      .catch(err => {
        console.error("Gagal fetch labels:", err);
      });
  }, [showLabelModal]);
  // HANDLE MEMBER
  useEffect(() => {
    if (showMemberModal) {
      getAllUser('/user?no_paging=yes')
        .then(res => {
          setAllUser(res.data.data);
          setFilteredUsers(res.data.data);
        })
        .catch(err => console.error("Gagal fetch user:", err));
    }
  }, [showMemberModal]);
  
  useEffect(() => {
    getAllUser(`/user?no_paging=yes`)
      .then(res => setAllMember(res.data.data))
      .catch(err => console.error("Gagal fetch user:", err));
  }, []);
  
  useEffect(() => {
    if (task.assign_to_user?.data) {
      setCurrentMember(task.assign_to_user.data);
    } else {
      setCurrentMember([]);
    }
  }, [task.assign_to_user]);
  
  useEffect(() => {
    if (task.label?.data) {
      setCurrentLabeled(task.label.data);
    } else {
      setCurrentLabeled([]);
    }
  }, [task.label]);
  
  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);
  
  if (!taskData) {
    return <div>Loading...</div>;
  }
//=======================*END USE EFFECT*======================================//
  
  return (
    <div className="modal-overlay" onClick={onClose}>
       <div
        className="modal-container d-flex flex-column"
        style={{ gap: '1rem', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Box 1: atas */}
        <div className="bg-light border p-3 mb-1 d-flex flex-column w-100">
          {/* Section 1: Close Button */}
          <div className="d-flex justify-content-end w-100 mb-2"> {/* Adjust margin-bottom via mb-* */}
            <button 
              className="btn btn-light p-1" 
              onClick={onClose}
              style={{ flexShrink: 0 }}
            >
              <X size={24} />
            </button>
          </div>

          <div>
      {/* Section 2: Cover Image */}
      <div
        className="cover-image-container rounded mb-3 w-100"
        style={{
          height: '90px',
          background: coverImage
            ? `url(${coverImage})`
            : '#f8f9fa',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => fileInputCoverRef.current?.click()} // klik cover untuk upload juga
      >
        {!coverImage && (
          <div className="text-muted d-flex h-100 align-items-center justify-content-center">
            No Cover
          </div>
        )}
      </div>
      </div>

          {/* Section 3: Completion Check + Title */}
          <div className="d-flex align-items-center gap-3 w-100">
            <div
              className={`check-circle d-flex align-items-center justify-content-center 
                ${isCompleted ? 'checked' : ''} border rounded-circle`}
              style={{
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                flexShrink: 0
              }}
              onClick={handleToggleComplete}
            >
              {isCompleted && '✓'}
            </div>

            {isEditingTitle ? (
              <input
                type="text"
                className="form-control flex-grow-1 text-start"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleSaveTitle} // Simpan saat keluar dari input
                onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                autoFocus
                style={{ 
                  maxWidth: '800px', 
                  height: '45px' 
                }}
              />
            ) : (
              <h2 
                className="modal-title mb-0 flex-grow-1 text-start" 
                onClick={() => setIsEditingTitle(true)}
                style={{ 
                  cursor: 'text',
                  fontSize: '1.75rem' 
                }}
              >
                {title}
              </h2>
            )}
          </div>
        </div>

        {/* Box 2: bawah */}
        <div className="bg-white border p-3 d-flex flex-row align-items-start gap-3 min-vh-100 h-100 w-100">
          {/* Left Column */}
          <div className="flex-grow-1 w-75">
            <button
            className={`btn btn-sm mb-3 ${isWatched ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={handleToggleWatch}
          >
            <Eye size={16} className="me-1" />
            {isWatched ? 'Watching' : 'Watch'}
          </button>

            <div className="mb-4">
              <h5 className="text-start section-title mb-2">
                <FontAwesomeIcon icon={faUser} className="me-2" /> Member
              </h5>
              {currentMember.length === 0 ? (
                <p className="text-muted">Belum ada member.</p>
              ) : (
                <ul className="list-unstyled d-flex flex-wrap">
                  {currentMember.map((member, idx) => {
                    const user = allMember.find(u => u.id === member.id);
                    if (!user) return null;
                    const initials = getInitials(user.name);
                    const bgColor = getColorFromInitial(initials);
                    const textColor = getContrastingTextColor(bgColor);
                    return (
                      <li key={idx} className="me-2 mb-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: bgColor,
                            width: '40px',
                            height: '40px',
                            color: textColor,
                            fontWeight: 600,
                          }}
                          title={user.name}
                        >
                          {initials}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mb-4">
              <h5 className="text-start section-title mb-2">
                <FontAwesomeIcon icon={faTag} className="me-2" />
                Label
              </h5>              
              
              {labeled && labeled.length > 0 ? (
                <div className="d-flex flex-wrap">
                  {labeled.map(lbl => (
                    <span
                      key={lbl.id}
                      className="badge rounded-2 me-2 mb-2 py-2 fs-6 fw-normal"
                      style={{
                        backgroundColor: parseColor(lbl.color),
                        color: '#fff'
                      }}
                    >
                      {lbl.title}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Belum ada label terpasang.</p>
              )}
            </div>

            <div
              className="description-wrapper border rounded mb-4"
              style={{ borderColor: '#ccc', padding: '4px 8px 8px' }}
            >
              <h3 className="section-title mb-2">
                <i className="fas fa-align-left me-2" /> Description
              </h3>

              <div className="description-box bg-light">
                <div
                  className="toolbar d-flex align-items-center px-2"
                  style={{ background: '#e9ecef', borderBottom: '1px solid #ced4da', minHeight: '38px' }}
                >
                  {toolbarButtons.map((btn, idx) => {
                    const isActive =
                      (btn.label === 'B' && editor?.isActive('bold')) ||
                      (btn.label === 'I' && editor?.isActive('italic')) ||
                      (btn.label === 'H1' && editor?.isActive('heading', { level: 1 })) ||
                      (btn.label === 'H2' && editor?.isActive('heading', { level: 2 })) ||
                      (btn.label === '• List' && editor?.isActive('bulletList')) ||
                      (btn.label === '1. List' && editor?.isActive('orderedList')) ||
                      (btn.label === 'Left' && editor?.isActive({ textAlign: 'left' })) ||
                      (btn.label === 'Center' && editor?.isActive({ textAlign: 'center' })) ||
                      (btn.label === 'Right' && editor?.isActive({ textAlign: 'right' })) ||
                      (btn.label === 'Justify' && editor?.isActive({ textAlign: 'justify' }));
                    return (
                      <button
                        key={idx}
                        onClick={btn.action}
                        className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-outline-secondary'} me-1`}
                        style={{ lineHeight: '1', padding: '0.25rem 0.5rem' }}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                  {isEditing && (
                    <div className="ms-auto">
                      <button onClick={handleSaveDescription} className="btn btn-sm btn-primary me-1">
                        Save
                      </button>
                      <button
                        onClick={() => {
                          editor.commands.setContent(taskData.description || '');
                          setIsEditing(false);
                        }}
                        className="btn btn-sm btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className={`description-edit ${isEditing ? 'active' : ''}`}>
                  <EditorContent editor={editor} className="description-editor" />
                </div>
              </div>
            </div>

            {showChecklist && (
              <div className="checklist-section mb-4">
                <h3 className="section-title mb-2">Checklist</h3>
                <div className="checklist-input d-flex mb-2">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Add new item..."
                    value={newChecklistItem}
                    onChange={e => setNewChecklistItem(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddChecklistItem}>
                    Add
                  </button>
                </div>
                <ul className="list-unstyled">
                  {checklistItems.map((item, index) => (
                    <li key={index} className="checklist-item mb-1">
                      <label className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={item.checked}
                          onChange={() => toggleChecklistItem(index)}
                        />
                        <span>{item.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {attachmentMessage && (
              <div className="attachment-section mb-4">
                <h3 className="section-title mb-2">Attachment</h3>
                <p>{attachmentMessage}</p>
                {attachments.length > 0 && (
                  <ul className="list-unstyled">
                    {attachments.map((attachment, index) => (
                      <li key={index} className="attachment-item mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{attachment.name}</span>
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => toggleDropdown(index)}>
                            ⋮
                          </button>
                          {attachment.showDropdown && (
                            <div className="dropdown-menu p-2 bg-light border rounded">
                              <button className="dropdown-item" onClick={() => handleFileDownload(attachment.file)}>
                                Download
                              </button>
                              <button className="dropdown-item" onClick={() => handleFileDelete(index)}>
                                Delete
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  const newName = prompt('Enter new file name:', attachment.name);
                                  if (newName?.trim()) handleEditFileName(index, newName.trim());
                                }}
                              >
                                Edit Name
                              </button>
                              <textarea
                                className="form-control mt-2"
                                placeholder="Add a comment..."
                                value={attachmentComments[index] || ''}
                                onChange={e => handleFileCommentChange(index, e.target.value)}
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
                  style={{ display: 'none' }}
                  onChange={handleAttachmentUpload}
                />
                <button className="btn btn-outline-secondary mt-2" onClick={triggerFileUpload}>
                  Upload File
                </button>
              </div>
            )}

            <div className="mb-4">
              <h3 className="section-title mb-2">Activity</h3>
              <div className="comment-wrapper d-flex mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddComment}>
                  Add
                </button>
              </div>
              <div className="activity-list">
                {activity.map((act, index) => (
                  <div key={index} className="activity-item d-flex mb-2">
                    <div
                      className="avatar rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{ width: '36px', height: '36px', background: '#ddd' }}
                    >
                      {act.user
                        .split(' ')
                        .map(w => w[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="activity-text mb-1">
                        <strong className="activity-user me-1">{act.user}</strong>
                        {act.text}
                      </p>
                      <small className="text-muted activity-time">{act.timestamp}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* Right Column: sidebar */}
        <div className="d-flex flex-column mt-n3 ms-auto align-self-start w-25" style={{ marginTop: '1rem' }}>
          <div
            className="sidebar d-flex flex-column pt-0"
            style={{ width: '200px', flexShrink: 0, gap: '0.5rem' }}
          >
            {[
              { icon: Users , label: 'Members', action: () => setShowMemberModal(true) },
              { icon: Tag, label: 'Labels', action: () => setShowLabelModal(true) },
              { icon: CheckSquare, label: 'Checklist', action: () => setShowChecklist(true) },
              { icon: Date, label: 'Set Due Dates', action: () => setShowDueDateModal(true) },
              { icon: Paperclip, label: 'Attachment', action: () => fileInputAttachmentRef.current?.click() },
              { icon: Image, label: 'Cover', action: () => fileInputCoverRef.current?.click() },
              { icon: Trash, label: 'Delete Task', action: () => setShowDeleteConfirm(true) },
              { icon: Move, label: 'Move', action: () => setShowMoveModal(true) },
              ].map(({ icon: Icon, label, action }, idx) => (
              <button
                key={idx}
                className="btn btn-outline-secondary d-flex align-items-center gap-2 py-2"
                onClick={action}
                type="button"
              >
                <Icon size={16} className="icon" /> {label}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>
          
      {showLabelModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="addLabelTitle"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <Tag className="me-2" size={20} /> 
                <h5 className="modal-title" id="addLabelTitle">Add Task Label</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowLabelModal(false)}
                />
              </div>

              {/* Body */}
              <div className="modal-body">
                {labels.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {labels.map(lbl => {
                    const isChecked = labeled.some(l => l.id === lbl.id);
                    return (
                      <li key={lbl.id} className="d-flex align-items-center mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          id={`label-checkbox-${lbl.id}`}
                          checked={isChecked}
                          onChange={() => handleLabelToggle(lbl)}
                        />
                        <span
                          className="flex-grow-1 p-2 rounded"
                          style={{
                            backgroundColor: parseColor(lbl.color),
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          {lbl.title}
                        </span>
                        <span
                          className="ms-2"
                          // onClick={() => handleLabelDelete(lbl.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Trash size={16} cla/>
                        </span>
                      </li>
                    );
                  })}
                  </ul>
                ) : (
                  <p className="mb-0">Belum ada label.</p>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer row g-0 w-100 px-0 justify-content-center">
                {/* Button Kiri */}
                  <div className="col-5 pe-1 ms-0">
                    <button
                      type="button"
                      className="btn btn-info flex-fill w-100"
                      style={{ backgroundColor: "#1e81b0", color: "white" }}
                      onClick={() => setShowLabelModal(false)}
                    >
                      Add Label
                    </button>
                  </div>
                {/* Button Kanan */}
                  <div className="col-5 ps-1">
                    <button
                      type="button"
                      className="btn flex-fill w-100"
                      style={{ backgroundColor: "#063970", color: "white" }}
                      onClick={handleSaveLabels}
                    >
                      Save 
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="addMemberLabel"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md"
            role="document"
            style={{ maxHeight: '80vh' }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                <h5 className="modal-title" id="addMemberLabel">
                  Add Task Member
                </h5>
                <button tpe="button" 
                className="btn-close" 
                aria-label="Close"
                onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body d-flex flex-column">
                <input
                  id="searchInput"
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter member name or email"
                  value={searchUser}
                  onChange={(e) => handleSearchUserChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />

                  <div className="mb-4">
                    <ul className="list-unstyled d-flex flex-column align-items-start">
                      {(filteredUsers.length === 0 ? ( 
                        <div className="text-muted w-100 text-center">
                          {searchUser ? "No members found" : "No members available"}
                        </div>
                      ) : (
                        (filteredUsers || []).map((user, idx) => {
                          const initials = getInitials(user.name);
                          const bgColor = getColorFromInitial(initials);
                          const textColor = getContrastingTextColor(bgColor);
                          const isMember = currentMember.some(member => member.id === user.id);
                          return (
                            <li key={idx} className="d-flex align-items-center mb-2">
                              {/* checkbox */}
                              <input
                                type="checkbox"
                                className="form-check-input me-2"
                                id={`select-user-${idx}`}
                                title={`Select ${user.name}`}
                                defaultChecked={isMember}
                                onChange={() => handleCheckboxChange(user)}
                              />

                              {/* avatar initials */}
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: bgColor,
                                  width: '40px',
                                  height: '40px',
                                  color: textColor,
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                                title={user.name}
                              >
                                {initials}
                              </div>

                              {/* name & role */}
                              <div className="ms-2 d-flex flex-column">
                                <span>{user.name}</span>
                                <small className="text-muted">{user.role.name} - {user.divisi.name}</small>
                              </div>
                            </li>
                          );
                        })
                      ))}
                    </ul>
                  </div>
                </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn fw-bold"
                  style={{ backgroundColor: "#063970", color: "white" }}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="task-detail">
      {/* Bagian atas: judul task */}
      <h1>{taskData?.title}</h1>
      {/* Tampilkan due date jika ada */}
      {taskData?.dueDate && (
        <p style={{ color: '#666' }}>Due Date: {taskData.dueDate}</p>
      )}</div>
    
      {showDueDateModal && (
      <div className="due-date-content">
        <div className="due-date-overlay" onClick={(e) => e.stopPropagation()}>
          <h2>Set Due Date</h2>
          <input type="date" value={dueDate} onChange={handleDateChange} />
          
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button onClick={handleSaveDueDate} style={{ flex: 1, backgroundColor: '#28a745', color: '#fff' }}>
              Save
            </button>
            <button onClick={toggleDueDateModal} style={{ flex: 1 }}>
              Close
            </button>
          </div>
        </div>
      </div>
        )}

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
