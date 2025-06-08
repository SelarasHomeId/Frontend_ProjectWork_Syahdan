import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Eye, Users, Tag, CheckSquare, Paperclip, Image, 
  Trash,Edit,Calendar,
  Pencil,
  MoreVertical
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
import { 
  getTaskById, updateTask, getLabel, getAllUser,deleteLabel,createLabel, updateLabel, 
  getAllBoardByWorkspaceId, workspaceFind, getTaskFiles, deleteAttachment,deleteTask, uploadAttachment,
  renameAttachment, createTaskComment, getAllCommentByTaskId, updateTaskComment, deleteTaskComment,
  createTaskChecklist,
  getAllChecklistByTaskId,
  deleteTaskChecklist,
  editTaskChecklist,
  createTaskChecklistItem,
  updateTaskChecklistItem,
  deleteTaskChecklistItem,
  convertTaskChecklistItem,
} from '../service/apiService';
import "../styles/TaskDetail.css";
import { Move } from 'lucide-react';
import TextAlign from '@tiptap/extension-text-align'
import { FaAlignLeft, FaAlignCenter, FaAlignJustify, FaAlignRight, FaTrash,} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faTag, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { getColorFromInitial, getInitials, getContrastingTextColor, } from "../utils/general";
import { debounce } from "lodash";
import csvIcon from "../assets/img/csv.png";
import docxIcon from "../assets/img/docx.png";
import mp3Icon from "../assets/img/mp3.png";
import mp4Icon from "../assets/img/mp4.png";
import pdfIcon from "../assets/img/pdf.png";
import pptxIcon from "../assets/img/pptx.png";
import txtIcon from "../assets/img/txt.png";
import xlsxIcon from "../assets/img/xlsx.png";
import imgIcon from "../assets/img/img.png";
import LogoSelaras from "../assets/img/selaras_logo2.png"; 
import Cookies from "js-cookie";

const TaskDetail = ({ task, onClose, onDelete}) => {
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
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState({});
  const [newChecklist, setNewChecklist] = useState("");
  const [checklistIdEdit, setChecklistIdEdit] = useState(0);
  const [showChecklistEditModal, setShowChecklistEditModal] = useState(false);
  const [newChecklistItemEdit, setNewChecklistItemEdit] = useState("");
  const [checklistItemIdEdit, setChecklistItemIdEdit] = useState(0);
  const [showChecklistItemEditModal, setShowChecklistItemEditModal] = useState(false);
  const [showMoveChecklistItemModal, setShowMoveChecklistItemModal] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState('');
  const [showDueDateItemModal, setShowDueDateItemModal] = useState(false);
  const [dueDateItem, setDueDateItem] = useState('');
  const toggleDueDateItemModal = () => {
    setShowDueDateItemModal(!showDueDateItemModal);
  };
  const [showMemberItemModal, setShowMemberItemModal] = useState(false);
  const [currentMemberItem, setCurrentMemberItem] = useState([]);
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
  const [labeled, setCurrentLabeled] = useState([]);
  const [showAddLabelModal, setShowAddLabelModal] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#ff0000'); 
  // DESCRIPTION
  const [taskData, setTaskData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // DUE DATE
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const toggleDueDateModal = () => {
    setShowDueDateModal(!showDueDateModal);
  };
  //ATTACHMENT
  const [attachments, setAttachments] = useState([]);
  const fileInputAttachmentRef = useRef(null);
  const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
  //DELETE
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  //COMMMENT
  const [comment, setComment] = useState("");
  const [activity, setActivity] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentEdit, setCommentEdit] = useState("");
  const [commentIdEdit, setCommentIdEdit] = useState(0);
  const [showCommentDeleteConfirm, setShowCommentDeleteConfirm] = useState(false);
  const [commentIdDelete, setCommentIdDelete] = useState(0);
  //MOVE
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingBoards, setLoadingBoards] = useState(false);
//======================= *END USE STATE*====================================

//======================= *START FUNCTION*====================================  
  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      try {
        await updateTask(task.id, { cover: file });
      } catch (err) {
        console.error(err);
        alert('Gagal update due date');
      }
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    try {
      await updateTask(task.id, { delete_cover: true });
      setCoverImage(null);
    } catch (err) {
      console.error(err);
      alert('Gagal update due date');
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

  // Handle due date
  const handleDateChange = (e) => {
    setDueDate(e.target.value.replace("T", " "));
  };

  const handleSaveDueDate = async () => {
    try {
      await updateTask(task.id, { due_date: dueDate }, "application/json");
      setShowDueDateModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal update due date');
    }
  };

  const handleRemoveDueDate = async () => {
    try {
      await updateTask(task.id, { due_date: '' }, "application/json");
      setDueDate('')
    } catch (err) {
      console.error(err);
      alert('Gagal update due date');
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

  //lABEL
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

  const handleNewLabelSubmit = async () => {
    if (!newLabelName.trim()) return alert('Nama label tidak boleh kosong');
    if (!/^#[0-9A-Fa-f]{6}$/.test(newLabelColor)) return alert('Warna tidak valid');
    const intColor = (parseInt(newLabelColor.slice(1), 16) >>> 0).toString();
    try {
      await createLabel({ title: newLabelName.trim(), color: intColor });
      alert('Label berhasil dibuat');
      setNewLabelName('');
      setNewLabelColor('#ff0000');
      setShowAddLabelModal(false);
      setShowLabelModal(true);
    } catch (err) {
      console.error('Gagal menambah label:', err);
      alert('Gagal menambah label');
    }
  };

  const handleLabelDelete = async (labelId) => {
    if (!window.confirm("Yakin ingin menghapus label ini?")) return;
    try {
      await deleteLabel(labelId);
      setLabels(prev => prev.filter(l => l.id !== labelId));
      setCurrentLabeled(prev => prev.filter(l => l.id !== labelId));
    } catch (err) {
      console.error("Gagal menghapus label:", err);
      alert("Gagal menghapus label");
    }
  };

  const handleLabelUpdate = async (lbl) => {
    const newTitle = window.prompt('Edit nama label:', lbl.title || '');
    if (newTitle === null) return;
    if (!newTitle.trim()) return alert('Nama label tidak boleh kosong');

    try {
      await updateLabel({ labelId: lbl.id, title: newTitle.trim() });
      alert(`Label diperbarui menjadi "${newTitle.trim()}"`);
      fetchLabels();
    } catch (err) {
      console.error('Gagal update label:', err);
      alert('Gagal memperbarui label');
    }
  };

  const fetchLabels = () => {
    getLabel()
      .then(data => setLabels(data || []))
      .catch(err => console.error("Gagal fetch labels:", err));
  };

  //CHECKLIST 
  const fetchChecklist = async () => {
    const response = await getAllChecklistByTaskId(task.id)
    setChecklist(response);
  }

  const handleAddChecklist = async () => {
    if (newChecklist.trim()) {
      await createTaskChecklist({
        task_id: task.id,
        title: newChecklist
      })
      await fetchChecklist()
      setNewChecklist("");
      setShowChecklistModal(false)
    }
  };

  const handleEditChecklist = async () => {
    if (newChecklist.trim()) {
      await editTaskChecklist(checklistIdEdit,{
        title: newChecklist
      })
      await fetchChecklist()
      setNewChecklist("");
      setChecklistIdEdit(0)
      setShowChecklistEditModal(false)
    }
  };

  const handleDeleteChecklist =  async (checklistId) => {
    await deleteTaskChecklist(checklistId)
    await fetchChecklist();
  };

  const handleAddChecklistItem = async (checklistId) => {
    const newItemText = newChecklistItem[checklistId];
    if (!newItemText || newItemText.trim() === '') return;

    await createTaskChecklistItem({
      task_checklist_id: checklistId,
      title: newItemText
    })
    await fetchChecklist()
    setNewChecklistItem(prev => ({ 
      ...prev, 
      [checklistId]: ''
    }))
  };

  const toggleChecklistItem = async (itemId, newStatus) => {
    await updateTaskChecklistItem(itemId,{
      is_completed: newStatus
    })
    await fetchChecklist()
  };

  const handleRenameChecklistItem = async () => {
    if (newChecklistItemEdit.trim()) {
      await updateTaskChecklistItem(checklistItemIdEdit,{
        title: newChecklistItemEdit
      })
      await fetchChecklist()
      setNewChecklistItemEdit("");
      setChecklistItemIdEdit(0)
      setShowChecklistItemEditModal(false)
    }
  };

  const handleDeleteChecklistItem =  async (itemId) => {
    await deleteTaskChecklistItem(itemId)
    await fetchChecklist();
  };

  const handleConvertChecklistItem =  async (itemId) => {
    await convertTaskChecklistItem(itemId)
    await fetchChecklist();
  };

  const handleMoveChecklistItem = async () => {
    if (!selectedChecklist) return alert('Pilih checklist terlebih dahulu');
    try {
      await updateTaskChecklistItem(checklistItemIdEdit,{
        task_checklist_id: parseInt(selectedChecklist)
      })
      await fetchChecklist()
      setChecklistItemIdEdit(0)
      setSelectedChecklist('')
      setShowMoveChecklistItemModal(false)
    } catch (err) {
      console.error('Gagal memindah item:', err);
      alert('Gagal memindah item');
    }
  };

  const handleDateItemChange = (e) => {
    setDueDateItem(e.target.value.replace("T", " "));
  };

  const handleSaveDueDateItem = async () => {
    try {
      await updateTaskChecklistItem(checklistItemIdEdit, { due_date: dueDateItem }, "application/json");
      await fetchChecklist()
      setChecklistItemIdEdit(0)
      setDueDateItem('')
      setShowDueDateItemModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal update due date item');
    }
  };

  const handleRemoveDueDateItem = async (itemId) => {
    try {
      await updateTaskChecklistItem(itemId, { due_date: '' }, "application/json");
      await fetchChecklist()
      setDueDateItem('')
    } catch (err) {
      console.error(err);
      alert('Gagal update due date item');
    }
  };

  const closeModalMemberItem = useCallback(() => {
    setShowMemberItemModal(false);
    setSearchUser('');
    setFilteredUsers(allUser);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
  },[allUser, setShowMemberItemModal]);

  const handleCheckboxChangeMemberItem = user => {
    setCurrentMemberItem(prev => {
      if (prev.some(m => m.id === user.id)) {
        return prev.filter(m => m.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const handleSaveChangesMemberItem = async () => {
    const memberIds = currentMemberItem.map(m => m.id);
    try {
      await updateTaskChecklistItem(checklistItemIdEdit, { assign_to_user: memberIds }, "application/json");
      await fetchChecklist()
      setChecklistItemIdEdit(0)
      setCurrentMemberItem([])
      closeModalMemberItem();
    } catch (err) {
      console.error(err);
      alert('Gagal update member item');
    }
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
    content:'',
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

  const fetchComment = async () => {
    const response = await getAllCommentByTaskId(task.id)
    setActivity(response);
  }

  const handleAddComment =  async() => {
    if (comment.trim()) {
      await createTaskComment({
        task_id: task.id,
        comment: comment
      })
      await fetchComment();
      setComment("");
    }
  };

  const handleEditComment =  async() => {
    if (commentEdit.trim()) {
      await updateTaskComment(commentIdEdit,{
        comment: commentEdit
      })
      await fetchComment();
      setCommentEdit("");
      setCommentIdEdit(0);
      setShowCommentModal(false);
    }
  };

  const handleDeleteComment =  async() => {
    await deleteTaskComment(commentIdDelete)
    await fetchComment();
    setCommentIdDelete(0);
    setShowCommentDeleteConfirm(false)
  };

  //======================== FILE ATTACHMENT=======================
  const toggleDropdown = idx => {
    setAttachments(prev =>
      prev.map((att, i) => ({
        ...att,
        showDropdown: i === idx ? !att.showDropdown : false
      }))
    );
  };

  const handleAttachmentUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadAttachment(task.id, file);
      if (res.success) {
        const resfile = await getTaskFiles(task.id);
        if (resfile.success && Array.isArray(resfile.data.data)) {
          const files = resfile.data.data.map(f => ({
            id: f.id,
            name: f.file.name,
            ext: f.file.ext,
            urlDownload: f.file.content,
            urlView: f.file.view_saved,
            createdAt: f.created_at,
            showDropdown: false,
          }));
          setAttachments(files);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      // reset input
      e.target.value = null;
    }
  };

  const fetchAttachment = async () => {
    try {
      const res = await getTaskFiles(task.id);
      if (res.success && Array.isArray(res.data.data)) {
        const files = res.data.data.map(f => ({
          id: f.id,
          name: f.file.name,
          ext: f.file.ext,
          urlDownload: f.file.content,
          urlView: f.file.view_saved,
          createdAt: f.created_at,
          showDropdown: false,
        }));
        setAttachments(files);
      }
    } catch (err) {
      console.error('Failed to fetch attachments:', err);
    }
  };

  const handleFileDelete = async (att) => {
    if (!window.confirm(`Delete "${att.name}"?`)) return;

    try {
      await deleteAttachment(att.id);
      fetchAttachment();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Download handler
  const handleFileDownload = (fileObj) => {
    const link = document.createElement('a');
    link.href = fileObj.urlDownload;
    link.download = fileObj.name;
    link.click();
  };

  //PreviewFile
  const handlePreview = (att) => {
    const imageExt = ['jpg', 'jpeg', 'png'];
    const pdfExt = ['pdf'];
    const docExt = ['doc', 'docx'];
    const pptExt = ['ppt', 'pptx'];
    const videoExt = ['mp4', 'mov'];
    const audioExt = ['mp3', 'wav'];
    const txtExt = ['txt'];
    const xlsxExt = ['xlsx', 'xls'];

    const ext = att.ext.toLowerCase();

    if (imageExt.includes(ext)) {
      window.open(att.urlView, '_blank');
    } else if (pdfExt.includes(ext)) {
      window.open(att.urlView, '_blank');
    } else if (docExt.includes(ext) || pptExt.includes(ext) || xlsxExt.includes(ext)) {
      const viewerURL = `https://docs.google.com/viewer?url=${encodeURIComponent(att.urlView)}&embedded=true`;
      window.open(viewerURL, '_blank');
    } else if (videoExt.includes(ext)) {
      window.open(att.urlView, '_blank');
    } else if (audioExt.includes(ext)) {
      window.open(att.urlView, '_blank');
    } else if (txtExt.includes(ext)) {
      window.open(att.urlView, '_blank');
    } else {
      alert('Preview tidak tersedia untuk ekstensi ini.');
    }
  };

  // Rename handler
  const handleEditFileName = async (att, newName) => {
    if (!newName.trim()) return;
    
    try {
      await renameAttachment(att.id, newName.trim());
      fetchAttachment();
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Gagal mengganti nama file");
    }
  };

  const closeAllDropdown = () => {
    setAttachments(prev =>
      prev.map(att => ({
        ...att,
        showDropdown: false,
      }))
    );
  };

  const triggerFileUpload = () => fileInputAttachmentRef.current?.click();

  // ======================= MOVE========================================//
  const handleOpenMove = () => {
    setShowMoveModal(true);
    setLoadingWorkspaces(true);
    workspaceFind()
      .then(data => {
        setWorkspaces(data || []);
        const currentWs = task.workspace?.id?.toString() || '';
        setSelectedWorkspace(currentWs);
      })
      .catch(err => console.error('Gagal fetch workspaces:', err))
      .finally(() => setLoadingWorkspaces(false));
  };

  const handleMoveTask = async () => {
    if (!selectedWorkspace || !selectedBoard) return alert('Pilih workspace dan board terlebih dahulu');
    try {
      await updateTask(task.id, {workspace_id: selectedWorkspace,board_id: selectedBoard});
      alert('Task berhasil dipindah');
      setShowMoveModal(false);
      const res = await getTaskById(task.id);
      onClose(res.data.data);
    } catch (err) {
      console.error('Gagal memindah task:', err);
      alert('Gagal memindah task');
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      alert('Task berhasil dihapus');
      setShowDeleteConfirm(false);
      onDelete?.(task.id);
      onClose();
    } catch (err) {
      console.error('Gagal menghapus task:', err.response?.data || err.message);
      alert('Gagal menghapus task');
    }
  };
//======================= END MOVE ======================================//

//=======================* END FUNCTION*====================================

  //=======================*USE EFFECT*======================================//
  // 1. Sync currentTitle dengan title
  useEffect(() => {
    if (title !== currentTitle) {
      setCurrentTitle(title);
    }
  }, [title,currentTitle]);

  // 2. Fetch task detail (sekali tiap task.id berubah)
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTaskById(task.id);
        const data = res.data.data;
        setTaskData(data);
        setIsWatched(!!data.watch);
        setIsCompleted(!!data.is_completed);
        setActivity(data.comment.data)
        setChecklist(data.checklist.data)
        setDueDate(data.due_date)
        setCoverImage(data.cover != null ? data.cover.view_saved : null)
      } catch (e) {
        console.error('Gagal load task:', e);
      }
    };
    fetchTask();
  }, [task]);

  useEffect(() => {
    if (editor && taskData?.description) {
      editor.commands.setContent(taskData.description || '');
    }
  }, [editor, taskData?.description]);

  // 3. Fetch attachment files
  useEffect(() => {
    if (!task.id) return;

    const fetchFiles = async () => {
      try {
        const res = await getTaskFiles(task.id);
        if (res.success && Array.isArray(res.data.data)) {
          const files = res.data.data.map(f => ({
            id: f.id,
            name: f.file.name,
            ext: f.file.ext,
            urlDownload: f.file.content,
            urlView: f.file.view_saved,
            createdAt: f.created_at,
            showDropdown: false,
          }));
          setAttachments(files);
        }
      } catch (err) {
        console.error('Failed to fetch attachments:', err);
      }
    };

    fetchFiles();
  }, [task]);

  // 4. Move modal - fetch boards by workspace
  useEffect(() => {
    if (!showMoveModal || !selectedWorkspace) {
      setBoards([]);
      return;
    }

    setLoadingBoards(true);
    getAllBoardByWorkspaceId(selectedWorkspace)
      .then(data => {
        setBoards(data || []);
        const currentBoard = data?.find(b => b.id === task.board_id);
        setSelectedBoard(currentBoard ? currentBoard.id.toString() : '');
      })
      .catch(err => console.error('Gagal fetch boards:', err))
      .finally(() => setLoadingBoards(false));
  }, [showMoveModal, selectedWorkspace, task.board_id]);

  // 5. Fetch all members (hanya saat komponen mount)
  useEffect(() => {
    getAllUser('/user?no_paging=yes')
      .then(res => setAllMember(res.data.data))
      .catch(err => console.error('Gagal fetch user:', err));
  }, []);

  // 6. Fetch users saat buka Member Modal
  useEffect(() => {
    if (showMemberModal || showMemberItemModal) {
      getAllUser('/user?no_paging=yes')
        .then(res => {
          setAllUser(res.data.data);
          setFilteredUsers(res.data.data);
        })
        .catch(err => console.error('Gagal fetch user:', err));
    }
  }, [showMemberModal, showMemberItemModal]);

  // 7. Fetch labels saat buka Label Modal atau selesai Add Label
  useEffect(() => {
    if (showLabelModal || (!showAddLabelModal && showLabelModal)) {
      fetchLabels();
    }
  }, [showLabelModal, showAddLabelModal]);

  // 8. Editor event listener
  useEffect(() => {
    if (!editor) return;

    const onFocus = () => setIsEditing(true);
    editor.on('focus', onFocus);

    return () => {
      editor.off('focus', onFocus);
    };
  }, [editor]);

  // 9. Debounce cleanup
  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  useEffect(() => {
    setCurrentMember(task.assign_to_user?.data || []);
    setCurrentLabeled(task.label?.data || []);
  }, [task]);
  //=======================*END USE EFFECT*======================================//
  
  return (
    <>
      {!taskData && (
          <div className="loading-overlay">
            <div className="spinner" />
          </div>
      )}
      <div className="modal-overlay" onClick={onClose}>
        {/* ============================== STACK UI ============================== */}
        <div
          className="modal-container d-flex flex-column"
          style={{ gap: '1rem', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Box 1: atas */}
          <div 
            className="border p-3 mb-1 d-flex flex-column w-100"
            style={{
              backgroundImage: `url('${coverImage}')`,
              backgroundColor: '#f0f0f0',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Section 1: Close Button */}
            <div className="d-flex justify-content-between align-items-center w-100 mb-2 position-relative">
              {coverImage && (
                <button
                  onClick={handleRemoveImage}
                  className="position-absolute"
                  style={{
                    top: 8,
                    left: 8,
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                  title="Remove image"
                >
                  <FaTrash size={14} color="#000"/>
                </button>
              )}

              {/* Loading tengah */}
              {taskData === null && (
                <div className="d-flex align-items-center gap-2 position-absolute start-50 translate-middle-x">
                  <div className="spinner-border spinner-border-sm text-danger" role="status" />
                  <span className="text-danger small">Prepare your data...</span>
                </div>
              )}

              {/* Spacer kiri agar jarak merata */}
              <div style={{ width: '24px' }} />

              {/* Tombol close kanan */}
              <button 
                className="btn btn-light p-1 ms-auto" 
                onClick={onClose}
                style={{ flexShrink: 0 }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Section 2: Cover Image */}
            <div
                className="position-relative mb-3"
                style={{
                    width: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                }}
            >
              <div
                className="cover-image-container"
                style={{
                  height: '100px',
                  backgroundColor: coverImage ? 'transparent' : '#f0f0f0',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  cursor: 'pointer',
                  transition: '0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => fileInputCoverRef.current?.click()}
                onMouseEnter={(e) => {
                  if (coverImage) {
                    e.currentTarget.style.filter = 'brightness(0.85)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (coverImage) {
                    e.currentTarget.style.filter = 'brightness(1)';
                  }
                }}
              >
                {!coverImage && (
                    <div style={{color: '#aaa', fontSize: '14px'}}>
                        Click to Upload Cover
                    </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                  type="file"
                  accept="image/*"
                  ref={fileInputCoverRef}
                  style={{display: 'none'}}
                  onChange={handleCoverImageChange}
              />
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
          <div className="bg-white border p-3 d-flex flex-row align-items-start gap-3 w-100">
            {/* Left Column */}
            <div 
              className="d-flex flex-column flex-grow-1 w-75"
            >
              <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <button
                      className={`btn btn-sm d-inline-flex align-items-center px-3 py-1 fs-6 fw-semibold ${
                      isWatched ? 'btn-success' : 'btn-outline-secondary'
                      }`}
                      onClick={handleToggleWatch}
                  >
                      <Eye size={16} className="me-1" />
                      {isWatched ? 'Watching' : 'Watch'}
                  </button>

                  {dueDate && (() => {
                    const date = new Date(dueDate.replace(' ', 'T'));
                    const now = new Date();
                    const isCompletedStatus = isCompleted === true;

                    const sameYear = date.getFullYear() === now.getFullYear();

                    const datePart = date.toLocaleDateString(undefined, {
                      year: sameYear ? undefined : 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    const timePart = date.toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });

                    let badgeClass = "badge bg-success-subtle text-success";
                    let additionalText = "";

                    if (isCompletedStatus) {
                      additionalText = " - completed";
                    } else {
                      const diffInMs = date - now;
                      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

                      if (diffInMs < 0) {
                        badgeClass = "badge bg-danger-subtle text-danger";
                        additionalText = " - overdue";
                      } else if (diffInDays <= 1) {
                        badgeClass = "badge bg-secondary-subtle text-secondary";
                        additionalText = " - due soon";
                      } else {
                        badgeClass = "badge bg-secondary-subtle text-secondary";
                      }
                    }

                    return (
                      <div className="position-relative d-inline-block">
                        <span className={`${badgeClass} d-inline-flex align-items-center px-3 py-2 fs-6 fw-semibold`}>
                          {datePart}, {timePart}{additionalText}
                        </span>
                        <button 
                          onClick={handleRemoveDueDate}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: 'red',
                            border: 'none',
                            borderRadius: '50%',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            width: '20px',
                            height: '20px',
                            padding: 0,
                            cursor: 'pointer',
                            lineHeight: '1',
                            textAlign: 'center',
                            boxShadow: '0 0 2px rgba(0,0,0,0.3)'
                          }}
                          aria-label="Remove due date"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    );
                  })()}
              </div>

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
                className="description-wrapper rounded mb-4"
                style={{ padding: '4px 8px 8px' }}
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

              <div className="attachment-section mb-4">
                <h3 className="section-title mb-2 d-flex align-items-center gap-2">
                  <CheckSquare size={18} className="text-muted" />
                  Checklist
                </h3>
                {!checklist ? (
                  <div className="border rounded p-3 text-muted text-center">Belum ada Checklist</div>
                ) : (
                  <div className="d-flex flex-column align-items-start gap-1" >
                    {checklist.map((chk, idx) => (
                      <div className="checklist-section">
                        <h3 className="section-title mb-1 mt-1 d-flex justify-content-between align-items-center">
                          <span className="d-flex align-items-center gap-2">
                            {chk.title}
                            <button
                              type="button"
                              className="btn btn-sm p-0 border-0 bg-transparent"
                              onClick={() => {
                                setNewChecklist(chk.title)
                                setChecklistIdEdit(chk.id)
                                setShowChecklistEditModal(true)
                              }}
                            >
                              <Pencil size={16} className="text-primary" />
                            </button>
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm ms-2 py-0 px-2"
                            style={{ lineHeight: '1', background: 'transparent', border: 'none' }}
                            onClick={() => handleDeleteChecklist(chk.id)}
                          >
                            <X size={20} className="text-danger" />
                          </button>
                        </h3>
                        <p></p>
                        <div className="w-100 mt-2 mb-2">
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: chk.check_persentase || '0%',
                                transition: 'width 0.6s ease'
                              }}
                              aria-valuenow={parseInt(chk.check_persentase) || 0}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small className="text-muted">{chk.check_persentase || '0%'}</small>
                        </div>
                        <div className="checklist-input d-flex mb-2">
                          <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Add new item..."
                            value={newChecklistItem[chk.id] || ''}
                            onChange={e => 
                              setNewChecklistItem(prev => ({ 
                                ...prev, 
                                [chk.id]: e.target.value 
                              }))
                            }
                          />
                          <button className="btn btn-primary" onClick={() => handleAddChecklistItem(chk.id)}>
                            Add
                          </button>
                        </div>
                        <ul className="list-unstyled" style={{ paddingLeft: '8px' }}>
                          {(chk.item.data ?? []).map((item, index) => (
                            <li key={index} className="mb-2">
                              <div className="d-flex align-items-start">
                                <i className="bi bi-arrow-return-right text-secondary me-2 mt-2" style={{ fontSize: '20px' }}></i>
                                <div className="border rounded px-3 py-2 d-flex flex-column flex-grow-1 ">
                                  <div className="d-flex justify-content-between w-100 align-items-start">
                                    <div className="d-flex flex-row align-items-start flex-grow-1 me-2 w-100">
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-2 mt-1"
                                        checked={item.is_completed}
                                        style={{ cursor: "pointer" }}
                                        onChange={() => toggleChecklistItem(item.id, !item.is_completed)}
                                      />
                                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <span
                                          className="text-wrap d-block"
                                          style={{
                                            wordBreak: 'break-word',
                                            textDecoration: item.is_completed ? 'line-through' : 'none'
                                          }}
                                        >
                                          {item.title}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="dropdown align-self-start ms-2" data-bs-auto-close="true">
                                      <button
                                        className="btn btn-sm p-0 border-0 bg-transparent"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <MoreVertical size={18} />
                                      </button>
                                      <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                          <button 
                                            className="dropdown-item" 
                                            onClick={(e) => {
                                              const dropdown = e.target.closest('.dropdown');
                                              const toggleButton = dropdown?.querySelector('[data-bs-toggle="dropdown"]');
                                              if (toggleButton) toggleButton.click();

                                              setNewChecklistItemEdit(item.title);
                                              setChecklistItemIdEdit(item.id);
                                              setShowChecklistItemEditModal(true);
                                            }}
                                          >
                                            Edit
                                          </button>
                                        </li>
                                        <li>
                                          <button 
                                            className="dropdown-item" 
                                            onClick={(e) => {
                                              const dropdown = e.target.closest('.dropdown');
                                              const toggleButton = dropdown?.querySelector('[data-bs-toggle="dropdown"]');
                                              if (toggleButton) toggleButton.click();
                                              
                                              setChecklistItemIdEdit(item.id);
                                              setShowMoveChecklistItemModal(true)
                                            }}
                                          >
                                            Move
                                          </button>
                                        </li>
                                        <li>
                                          <button 
                                            className="dropdown-item" 
                                            onClick={(e) => {
                                              const dropdown = e.target.closest('.dropdown');
                                              const toggleButton = dropdown?.querySelector('[data-bs-toggle="dropdown"]');
                                              if (toggleButton) toggleButton.click();
                                              
                                              setChecklistItemIdEdit(item.id);
                                              setCurrentMemberItem(item.assign_to_user != null ? item.assign_to_user.data : [])
                                              setShowMemberItemModal(true)
                                            }}
                                          >
                                            Members
                                          </button>
                                        </li>
                                        <li>
                                          <button 
                                            className="dropdown-item" 
                                            onClick={(e) => {
                                              const dropdown = e.target.closest('.dropdown');
                                              const toggleButton = dropdown?.querySelector('[data-bs-toggle="dropdown"]');
                                              if (toggleButton) toggleButton.click();
                                              
                                              setChecklistItemIdEdit(item.id);
                                              setShowDueDateItemModal(true)
                                            }}
                                          >
                                            Due Date
                                          </button>
                                        </li>
                                        <li>
                                          <button 
                                            className="dropdown-item" 
                                            onClick={(e) => {
                                              const dropdown = e.target.closest('.dropdown');
                                              const toggleButton = dropdown?.querySelector('[data-bs-toggle="dropdown"]');
                                              if (toggleButton) toggleButton.click();

                                              handleDeleteChecklistItem(item.id);
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </li>
                                        <li>
                                          <button 
                                            className="dropdown-item" 
                                            onClick={(e) => {
                                              const dropdown = e.target.closest('.dropdown');
                                              const toggleButton = dropdown?.querySelector('[data-bs-toggle="dropdown"]');
                                              if (toggleButton) toggleButton.click();

                                              handleConvertChecklistItem(item.id);
                                            }}
                                          >
                                            Convert To Task
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  {item.due_date && (() => {
                                    const date = new Date(item.due_date.replace(' ', 'T'));
                                    const now = new Date();
                                    const isCompletedStatus = item.is_completed === true;

                                    const sameYear = date.getFullYear() === now.getFullYear();

                                    const datePart = date.toLocaleDateString(undefined, {
                                      year: sameYear ? undefined : 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    });

                                    const timePart = date.toLocaleTimeString(undefined, {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                    });

                                    let badgeClass = "badge bg-success-subtle text-success";
                                    let additionalText = "";

                                    if (isCompletedStatus) {
                                      additionalText = " - completed";
                                    } else {
                                      const diffInMs = date - now;
                                      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

                                      if (diffInMs < 0) {
                                        badgeClass = "badge bg-danger-subtle text-danger";
                                        additionalText = " - overdue";
                                      } else if (diffInDays <= 1) {
                                        badgeClass = "badge bg-secondary-subtle text-secondary";
                                        additionalText = " - due soon";
                                      } else {
                                        badgeClass = "badge bg-secondary-subtle text-secondary";
                                      }
                                    }

                                    return (
                                      <div className="d-inline-block mt-2">
                                        <span className={`${badgeClass} d-inline-flex align-items-center px-3 py-2 fs-8 fw-semibold position-relative`}>
                                          {datePart}, {timePart}{additionalText}
                                          <button
                                            onClick={() => handleRemoveDueDateItem(item.id)}
                                            style={{
                                              position: 'absolute',
                                              top: '-6px',
                                              right: '-6px',
                                              backgroundColor: 'red',
                                              border: 'none',
                                              borderRadius: '50%',
                                              color: 'white',
                                              fontWeight: 'bold',
                                              fontSize: '0.8rem',
                                              width: '18px',
                                              height: '18px',
                                              padding: 0,
                                              cursor: 'pointer',
                                              lineHeight: '1',
                                              textAlign: 'center',
                                              boxShadow: '0 0 2px rgba(0,0,0,0.3)'
                                            }}
                                            aria-label="Remove due date"
                                          >
                                            <X size={13} />
                                          </button>
                                        </span>
                                      </div>
                                    );
                                  })()}
                                  
                                  {item.assign_to_user && (() => {
                                    return (
                                      <div className="d-flex flex-row flex-wrap mt-2">
                                        {item.assign_to_user.data.map((member, idx) => {
                                          const user = allMember.find(u => u.id === member.id);
                                          if (!user) return null;
                                          const initials = getInitials(user.name);
                                          const bgColor = getColorFromInitial(initials);
                                          const textColor = getContrastingTextColor(bgColor);

                                          return (
                                            <div key={idx} className="d-inline-block me-2 mb-2">
                                              <li style={{ listStyleType: 'none' }}>
                                                <div
                                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                                  style={{
                                                    backgroundColor: bgColor,
                                                    width: '28px',       // diperkecil dari 40px
                                                    height: '28px',
                                                    fontSize: '0.7rem',  // teks diperkecil
                                                    color: textColor,
                                                    fontWeight: 600,
                                                  }}
                                                  title={user.name}
                                                >
                                                  {initials}
                                                </div>
                                              </li>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="attachment-section mb-4">
                <h3 className="section-title mb-2 d-flex align-items-center gap-2">
                  <Paperclip size={18} className="text-muted" />
                  Attachment
                </h3>
                {attachments.length === 0 ? (
                  <div className="border rounded p-3 text-muted text-center">Belum ada File</div>
                ) : (
                  <div className="d-flex flex-row align-items-start flex-nowrap overflow-auto" style={{ gap: '0.25rem' }}>
                    {attachments.map((att, idx) => (
                      <div
                        key={att.id}
                        className="border rounded p-3 me-3 mb-3 text-start position-relative"
                        style={{
                          minWidth: '150px', // sebelumnya 120px
                          cursor: IMAGE_EXTENSIONS.includes(att.ext) ? 'pointer' : 'default',
                          position: 'relative',
                          zIndex: 1
                        }}
                        onClick={() => handlePreview(att)}
                      >
                        <div className="mb-2 d-flex align-items-center justify-content-center bg-light border rounded"
                            style={{ height: '120px', width: '120px', overflow: 'hidden', padding: '8px' }}>
                          <img
                            src={
                              att.ext === 'csv' ? csvIcon : 
                              att.ext === 'docx' ? docxIcon : 
                              att.ext === 'mp3' ? mp3Icon : 
                              att.ext === 'mp4' ? mp4Icon : 
                              att.ext === 'pdf' ? pdfIcon : 
                              att.ext === 'pptx' ? pptxIcon : 
                              att.ext === 'txt' ? txtIcon : 
                              att.ext === 'xlsx' ? xlsxIcon : 
                              att.ext === 'jpg' || 'jpeg' || 'png' ? imgIcon:
                              "no image"
                            }
                            alt={att.ext}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: IMAGE_EXTENSIONS.includes(att.ext) ? 'cover' : 'contain',
                              borderRadius: '6px',
                              display: 'block'
                            }}
                          />
                        </div>
                        <div className="text-truncate small" title={att.name}>
                          {att.name.length > 15 ? att.name.slice(0, 15) + '...' : att.name}
                        </div>
                        {/* Dropdown toggle */}
                        <button
                          className="btn btn-sm fw-bold fs-5 position-absolute dropdown-toggle-btn"
                          style={{ top: '12px', right: '-4px' }} 
                          onClick={e => {
                            e.stopPropagation();
                            toggleDropdown(idx);
                          }}
                        >
                          ⋮
                        </button>
                        {/* Dropdown menu */}
                        {att.showDropdown && (
                          <div
                            className="custom-dropdown p-2 bg-light border rounded"
                            style={{
                              position: 'absolute',
                              top: '32px',
                              right: '8px',
                              zIndex: 9999, 
                              backgroundColor: 'white',
                              display: 'block',
                            }}
                          >
                            <button className="dropdown-item" onClick={e => { e.stopPropagation(); handleFileDownload(att); closeAllDropdown();}}>
                              Download
                            </button>
                            <button className="dropdown-item" onClick={e => { e.stopPropagation(); handleFileDelete(att); closeAllDropdown();}}>
                              Delete
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={e=> {
                                e.stopPropagation();
                                const newName = prompt('Enter new file name:', att.name);
                                if (newName) handleEditFileName(att, newName);
                                closeAllDropdown();
                              }}
                            >
                              Edit Name
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="section-title mb-2">Activity</h3>
                <div className="comment-wrapper d-flex mb-3">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  />
                  <button className="btn btn-primary" onClick={handleAddComment}>
                    Add
                  </button>
                </div>
                <div className="activity-list">
                  {activity.map((data, index) => {
                    const userLogin = Cookies.get('id');
                    const initials = getInitials(data.created_by.name);
                    const bgColor = getColorFromInitial(initials);
                    const textColor = getContrastingTextColor(bgColor);
                    const isHistory = data.is_history;
                    // eslint-disable-next-line
                    const isCommentEdit = data.created_by.id == userLogin;

                    return (
                      <div key={index} className="activity-item d-flex mb-2 align-items-start">
                        {/* Avatar */}
                        {isHistory ? (
                          <img
                            src={LogoSelaras} // Ganti dengan path sesuai lokasi logo kamu
                            alt="History Logo"
                            className="rounded-circle me-2 flex-shrink-0"
                            style={{ width: '36px', height: '36px', minWidth: '36px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="avatar rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0"
                            style={{
                              width: '36px',
                              height: '36px',
                              backgroundColor: bgColor,
                              color: textColor,
                              minWidth: '36px',
                              fontWeight: 'bold'
                            }}
                          >
                            {initials}
                          </div>
                        )}

                        {/* Kontainer Isi */}
                        <div className="d-flex flex-grow-1">
                          {!isHistory ? (
                            <div
                              style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'normal',
                                width: '100%', // Tambahkan ini agar isi membentang penuh
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                            >
                              <strong className="d-block">{data.created_by.name}</strong>

                              {/* Komentar */}
                              <div className="mb-2">{data.comment}</div>

                              {/* Baris bawah: Edit | Delete dan Timestamp */}
                              <div className="d-flex justify-content-between align-items-center w-100">
                                {/* Kiri: Edit | Delete */}
                                {isCommentEdit ? (
                                  <div className="d-flex">
                                    <div
                                      className="me-2 text-primary text-decoration-none"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        setShowCommentModal(true)
                                        setCommentEdit(data.comment)
                                        setCommentIdEdit(data.id)
                                      }}
                                    >
                                      Edit
                                    </div>
                                    <div
                                      className="text-danger text-decoration-none"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        setShowCommentDeleteConfirm(true)
                                        setCommentIdDelete(data.id)
                                      }}
                                    >
                                      Delete
                                    </div>
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {/* Kanan: Timestamp */}
                                <small className="text-muted">
                                  {data.updated_at.replace("T", " ").replace("Z", "")}
                                </small>
                              </div>
                            </div>

                          ) : (
                            <>
                              <div
                                className="me-2 text-nowrap"
                                style={{ minWidth: 'max-content' }}
                              >
                                <strong className="d-block">{data.created_by.name}</strong>
                                <small className="text-muted d-block">{data.updated_at.replace("T", " ").replace("Z", "")}</small>
                              </div>
                              <div className="me-2 text-muted">|</div>
                              <div
                                className="flex-grow-1"
                                style={{
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                  whiteSpace: 'normal'
                                }}
                              >
                                {data.comment}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                  { icon: CheckSquare, label: 'Checklist', action: () => setShowChecklistModal(true) },
                  { icon: Calendar, label: 'Due Date', action: () => setShowDueDateModal(true) },
                  { icon: Paperclip, label: 'Attachment', action: triggerFileUpload },
                  { icon: Image, label: 'Cover', action: () => fileInputCoverRef.current?.click() },
                  { icon: Move, label: 'Move', action: handleOpenMove },
                  { icon: Trash, label: 'Delete Task', action: () => setShowDeleteConfirm(true) },
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
            <input
              ref={fileInputAttachmentRef}
              type="file"
              accept="*/*"
              style={{ display: 'none' }}
              onChange={handleAttachmentUpload}
            />
          </div>
        </div>
        
        {/* ============================== STACK MODAL ============================== */}
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
                      const isChecked = Array.isArray(labeled) && labeled.some(l => l && l.id === lbl.id);
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
                              className="flex-grow-1 p-2 rounded d-flex align-items-center"
                              style={{ backgroundColor: parseColor(lbl.color), color: '#fff', cursor: 'pointer' }}
                              onClick={() => handleLabelUpdate(lbl)}
                            >
                              {lbl.title || '(no title)'}
                              <Edit size={14} className="ms-2" />
                            </span>
                            <span className="ms-2" onClick={e => { e.stopPropagation(); handleLabelDelete(lbl.id); }} style={{ cursor: 'pointer' }}>
                              <Trash size={16} />
                            </span>
                          <span
                            className="ms-2"
                            onClick={(e) =>{ 
                              e.stopPropagation();
                              handleLabelDelete(lbl.id)}}
                            style={{ cursor: 'pointer' }}
                          >
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
                        onClick={() => setShowAddLabelModal(true)}
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

        {showAddLabelModal && (
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">New Label</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddLabelModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nama Label</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newLabelName}
                      onChange={e => setNewLabelName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Pilih Warna</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={newLabelColor}
                      onChange={e => setNewLabelColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddLabelModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-success" onClick={handleNewLabelSubmit}>
                    Create
                  </button>
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
        
        {showDueDateModal && (
          <div className="due-date-content">
            <div className="due-date-overlay" onClick={(e) => e.stopPropagation()}>
              <h2>Set Due Date</h2>
              <input
                type="datetime-local"
                step="1"
                value={dueDate ?? ''}
                onChange={handleDateChange}
              />

              <div style={{marginTop: '16px', display: 'flex', gap: '10px'}}>
                <button onClick={handleSaveDueDate}
                        style={{flex: 1, backgroundColor: '#28a745', color: '#fff'}}>
                    Save
                </button>
                <button onClick={toggleDueDateModal} style={{flex: 1}}>
                    Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showMoveModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="moveTaskLabel"
            aria-modal="true"
            onClick={() => setShowMoveModal(false)}
          >
            <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <FontAwesomeIcon icon={faArrowsAlt} className="me-2" />
                  <h5 className="modal-title" id="moveTaskLabel">Move Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowMoveModal(false)}
                  />
                </div>
                <div className="modal-body text-start">
                  <div className="mb-3">
                    <label className="form-label">Choose Workspace:</label>
                    {loadingWorkspaces ? (
                      <p>Loading workspaces...</p>
                    ) : (
                      <select
                        className="form-select"
                        value={selectedWorkspace}
                        onChange={e => setSelectedWorkspace(e.target.value)}
                      >
                        <option value="">Select Workspace</option>
                        {workspaces.map(ws => (
                          <option key={ws.id} value={ws.id}>{ws.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Choose Board:</label>
                    {loadingBoards ? (
                      <p>Loading boards...</p>
                    ) : (
                      <select
                        className="form-select"
                        value={selectedBoard}
                        onChange={e => setSelectedBoard(e.target.value)}
                        disabled={!selectedWorkspace}
                      >
                        <option value="">Select Board</option>
                        {boards.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowMoveModal(false)}
                  >
                    Cancel
                  </button>                
                  <button
                    type="button"
                    className="btn fw-bold"
                    style={{ backgroundColor: '#063970', color: 'white' }}
                    onClick={handleMoveTask}
                  >
                    Move
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="deleteTaskLabel"
            aria-modal="true"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteTaskLabel">
                    Confirm Delete
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowDeleteConfirm(false)}
                  />
                </div>
                <div className="modal-body text-start">
                  <p>Apakah yakin ingin menghapus task ini?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn fw-bold"
                    style={{ backgroundColor: '#dc3545', color: 'white' }}
                    onClick={handleDeleteTask}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCommentModal && (
          <div
            className="popup-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-box">
              <h3>Edit Comment</h3>
              <div className="popup-section">
                <input
                  type="text"
                  value={commentEdit}
                  onChange={(e) => setCommentEdit(e.target.value)}
                  placeholder="Edit your comment"
                  className="form-control"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.key === 'Enter' && handleEditComment()}
                />
              </div>
              <div className="popup-buttons mt-3">
                <button className="popup-btn confirm" onClick={handleEditComment}>
                  Save
                </button>
                <button className="popup-btn cancel" onClick={() => setShowCommentModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCommentDeleteConfirm && (
          <div
            className="popup-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-box">
              <h3>Are you sure you want to delete this comment?</h3>
              <div className="popup-buttons">
                <button
                  className="popup-btn confirm"
                  onClick={handleDeleteComment}
                >
                  Yes, Delete
                </button>
                <button className="popup-btn cancel" onClick={() => setShowCommentDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showChecklistModal && (
          <div
            className="popup-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-box">
              <h3>Add Checklist</h3>
              <div className="popup-section">
                <input
                  type="text"
                  value={newChecklist}
                  onChange={(e) => setNewChecklist(e.target.value)}
                  placeholder="Add checklist"
                  className="form-control"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                />
              </div>
              <div className="popup-buttons mt-3">
                <button className="popup-btn confirm" onClick={handleAddChecklist}>
                  Save
                </button>
                <button className="popup-btn cancel" onClick={() => setShowChecklistModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showChecklistEditModal && (
          <div
            className="popup-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-box">
              <h3>Edit Checklist</h3>
              <div className="popup-section">
                <input
                  type="text"
                  value={newChecklist}
                  onChange={(e) => setNewChecklist(e.target.value)}
                  placeholder="Edit checklist"
                  className="form-control"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.key === 'Enter' && handleEditChecklist()}
                />
              </div>
              <div className="popup-buttons mt-3">
                <button className="popup-btn confirm" onClick={handleEditChecklist}>
                  Save
                </button>
                <button className="popup-btn cancel" onClick={() => setShowChecklistEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showChecklistItemEditModal && (
          <div
            className="popup-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-box">
              <h3>Edit Checklist Item</h3>
              <div className="popup-section">
                <input
                  type="text"
                  value={newChecklistItemEdit}
                  onChange={(e) => setNewChecklistItemEdit(e.target.value)}
                  placeholder="Edit checklist item"
                  className="form-control"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameChecklistItem()}
                />
              </div>
              <div className="popup-buttons mt-3">
                <button className="popup-btn confirm" onClick={handleRenameChecklistItem}>
                  Save
                </button>
                <button className="popup-btn cancel" onClick={() => setShowChecklistItemEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showMoveChecklistItemModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="moveChecklistItemLabel"
            aria-modal="true"
            onClick={() => setShowMoveChecklistItemModal(false)}
          >
            <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <FontAwesomeIcon icon={faArrowsAlt} className="me-2" />
                  <h5 className="modal-title" id="moveChecklistItemLabel">Move Item</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowMoveChecklistItemModal(false)}
                  />
                </div>
                <div className="modal-body text-start">
                  <div className="mb-3">
                    <label className="form-label">Choose Checklist:</label>
                    <select
                      className="form-select"
                      value={selectedChecklist}
                      onChange={e => setSelectedChecklist(e.target.value)}
                    >
                      <option value="">Select Checklist</option>
                      {checklist.map(chk => (
                        <option key={chk.id} value={chk.id}>{chk.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedChecklist('')
                      setShowMoveChecklistItemModal(false)
                    }}
                  >
                    Cancel
                  </button>                
                  <button
                    type="button"
                    className="btn fw-bold"
                    style={{ backgroundColor: '#063970', color: 'white' }}
                    onClick={handleMoveChecklistItem}
                  >
                    Move
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDueDateItemModal && (
          <div className="due-date-content">
            <div className="due-date-overlay" onClick={(e) => e.stopPropagation()}>
              <h2>Set Due Date Item</h2>
              <input
                type="datetime-local"
                step="1"
                value={dueDateItem ?? ''}
                onChange={handleDateItemChange}
              />

              <div style={{marginTop: '16px', display: 'flex', gap: '10px'}}>
                <button onClick={handleSaveDueDateItem}
                        style={{flex: 1, backgroundColor: '#28a745', color: '#fff'}}>
                    Save
                </button>
                <button onClick={toggleDueDateItemModal} style={{flex: 1}}>
                    Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showMemberItemModal && (
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
                    Add Member to Item
                  </h5>
                  <button tpe="button" 
                  className="btn-close" 
                  aria-label="Close"
                  onClick={closeModalMemberItem}
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
                            const isMember = currentMemberItem.some(member => member.id === user.id);
                            return (
                              <li key={idx} className="d-flex align-items-center mb-2">
                                {/* checkbox */}
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  id={`select-user-${idx}`}
                                  title={`Select ${user.name}`}
                                  defaultChecked={isMember}
                                  onChange={() => handleCheckboxChangeMemberItem(user)}
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
                    onClick={handleSaveChangesMemberItem}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskDetail;
