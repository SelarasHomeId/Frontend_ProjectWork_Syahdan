import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "../styles/Workspace.css";

function Workspace({ workspaceName }) {
  const [cards, setCards] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const addCard = () => {
    const newCard = { id: cards.length + 1, title: `Card ${cards.length + 1}`, createdAt: new Date(), tasks: [] };
    setCards([...cards, newCard]);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const reorderedCards = Array.from(cards);
    const [removed] = reorderedCards.splice(source.index, 1);
    reorderedCards.splice(destination.index, 0, removed);

    setCards(reorderedCards);
  };

  const renameCard = (id, newTitle) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, title: newTitle } : card
    );
    setCards(updatedCards);
  };

  const copyCard = (cardId) => {
    const cardToCopy = cards.find(card => card.id === cardId);
    if (cardToCopy) {
      const copiedCard = { ...cardToCopy, id: cards.length + 1, title: `${cardToCopy.title} Copy` };
      setCards([...cards, copiedCard]);
    }
  };

  const addTaskToCard = (cardId) => {
    const taskDescription = prompt('Enter task description:');
    if (taskDescription) {
      const updatedCards = cards.map(card => 
        card.id === cardId ? { ...card, tasks: [...card.tasks, { id: card.tasks.length + 1, description: taskDescription }] } : card
      );
      setCards(updatedCards);
    }
  };

  const moveAllCards = () => {
    const allCardsMoved = [...cards]; 
    setCards(allCardsMoved);
  };

  const toggleDropdown = (cardId) => {
    setActiveDropdown(activeDropdown === cardId ? null : cardId);
  };

  return (
    <div className="workspace">
      <h2 className="workspace-title">{workspaceName} Workspace</h2>
      
      <div className="action-btns">
        <button className="btn add-card-btn" onClick={addCard}>Add Card</button>
      </div>

      <div className="cards-container">
        {cards.length === 0 ? (
          <p className="no-cards">No cards available for this workspace.</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="cards">
              {(provided) => (
                <div
                  className="card-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-body">
                            <h5 className="card-title">
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => renameCard(card.id, e.target.value)}
                                className="card-title-input"
                              />
                            </h5>
                            <p className="text-muted">Created At: {card.createdAt.toLocaleString()}</p>
                            
                            <div className="tasks-list">
                              {card.tasks.map((task) => (
                                <p key={task.id}>{task.description}</p>
                              ))}
                            </div>

                            <div className="card-actions">
                              <button 
                                className="btn" 
                                onClick={() => toggleDropdown(card.id)}>
                                  Action
                              </button>
                              {activeDropdown === card.id && (
                                <div className="dropdown-menu">
                                  <button className="btn add-task-btn" onClick={() => addTaskToCard(card.id)}>Add Task</button>
                                  <button className="btn copy-card-btn" onClick={() => copyCard(card.id)}>Copy</button>
                                  <button className="btn move-card-btn" onClick={() => moveAllCards()}>Move All Cards</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

export default Workspace;
