import React, { useState } from 'react';
import '../../styles/Marketing.css';
import { Card, Button, Dropdown, Modal, Form } from 'react-bootstrap';

const Marketing = () => {
  const [cards, setCards] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [editCardData, setEditCardData] = useState(null);
  const [newCardName, setNewCardName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const addCard = () => {
    const newCard = { 
      id: Date.now(), 
      name: `Card ${cards.length + 1}`, 
      dateCreated: new Date(), 
      tasks: [] 
    };
    setCards([...cards, newCard]);
  };

  const addTaskToCard = (cardId) => {
    if (taskInput.trim() !== '') {
      const newTask = {
        id: Date.now(),
        name: taskInput,
      };
      
      const updatedCards = cards.map(card =>
        card.id === cardId ? { ...card, tasks: [...card.tasks, newTask] } : card
      );
      setCards(updatedCards);
      setTaskInput('');
    }
  };

  const sortCards = (option) => {
    let sortedCards = [...cards];
    if (option === 'newest') {
      sortedCards.sort((a, b) => b.dateCreated - a.dateCreated);
    } else if (option === 'oldest') {
      sortedCards.sort((a, b) => a.dateCreated - b.dateCreated);
    } else if (option === 'alphabetical') {
      sortedCards.sort((a, b) => a.name.localeCompare(b.name));
    }
    setCards(sortedCards);
    setSortOption(option);
  };

  const copyList = () => {
    const copiedList = [...cards];
    alert('List copied successfully!');
    console.log('Copied List:', copiedList);
  };

  const deleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    alert('Card deleted!');
  };

  const openEditModal = (card) => {
    setEditCardData(card);
    setNewCardName(card.name);
    setShowModal(true);
  };

  const saveEditedCard = () => {
    if (newCardName.trim() === '') {
      alert('Card name cannot be empty!');
      return;
    }
    const updatedCards = cards.map(card =>
      card.id === editCardData.id ? { ...card, name: newCardName } : card
    );
    setCards(updatedCards);
    setShowModal(false);
    setNewCardName('');
    alert('Card updated successfully!');
  };

  const closeEditModal = () => {
    setShowModal(false);
    setNewCardName('');
  };

  return (
    <div className="marketing">
      <h2 className="heading">Marketing Division</h2>

      <div className="action-buttons">
        <Button variant="success" onClick={addCard}>Add Card</Button>
      </div>

      <div className="card-list">
        {cards.length === 0 ? (
          <p>No cards available. Click "Add Card" to create a new one.</p>
        ) : (
          cards.map((card) => (
            <Card key={card.id} className="card">
              <Card.Body>
                <Card.Title>{card.name}</Card.Title>
                <Card.Text>
                  <small>{card.dateCreated.toLocaleString()}</small>
                </Card.Text>

                <Form.Control
                  type="text"
                  placeholder="Add a task..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                />
                <Button variant="primary" onClick={() => addTaskToCard(card.id)} className="mt-2">Add Task</Button>

                <div className="task-list mt-3">
                  {card.tasks.length === 0 ? (
                    <p>No tasks added.</p>
                  ) : (
                    card.tasks.map((task) => (
                      <div key={task.id} className="task">
                        <span className="task-text">{task.name}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="card-actions mt-3">
                  <Dropdown className="d-inline">
                    <Dropdown.Toggle variant="info" id="dropdown-more-options">
                      More Options
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={copyList}>Copy List</Dropdown.Item>
                      <Dropdown.Item onClick={() => alert('Move list functionality triggered!')}>Move List</Dropdown.Item>
                      <Dropdown.Item onClick={() => alert('Move all cards functionality triggered!')}>Move All Cards</Dropdown.Item>
                      <Dropdown.Item onClick={() => openEditModal(card)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => deleteCard(card.id)}>
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown className="d-inline ml-3">
                    <Dropdown.Toggle variant="info" id="dropdown-sort-by">
                      Sort By
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => sortCards('newest')}>Date Created (Newest First)</Dropdown.Item>
                      <Dropdown.Item onClick={() => sortCards('oldest')}>Date Created (Oldest First)</Dropdown.Item>
                      <Dropdown.Item onClick={() => sortCards('alphabetical')}>Card Name (Alphabetically)</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="editCardName">
            <Form.Label>Card Name</Form.Label>
            <Form.Control
              type="text"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEditedCard}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Marketing;
