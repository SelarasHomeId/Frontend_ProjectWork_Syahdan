import React, { useState } from 'react';

const Marketing = () => {
  const [cards, setCards] = useState([]);
  const [sortOption, setSortOption] = useState('');

  // Add a new card
  const addCard = () => {
    const newCard = { id: Date.now(), name: `Card ${cards.length + 1}`, dateCreated: new Date() };
    setCards([...cards, newCard]);
  };

  // Sort cards
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

  // Copy list
  const copyList = () => {
    const copiedList = [...cards];
    alert('List copied successfully!');
    console.log('Copied List:', copiedList);
  };

  // Move list
  const moveList = () => {
    alert('Move list functionality triggered!');
  };

  // Move all cards
  const moveAllCards = () => {
    alert('Move all cards functionality triggered!');
  };

  return (
    <div className="marketing">
      <h2>Marketing Division</h2>
      <button onClick={addCard}>Add Card</button>
      <div>
        <button>
          More Options
          <ul>
            <li onClick={copyList}>Copy List</li>
            <li onClick={moveList}>Move List</li>
            <li onClick={moveAllCards}>Move All Cards</li>
          </ul>
        </button>
        <button>
          Sort By
          <ul>
            <li onClick={() => sortCards('newest')}>Date Created (Newest First)</li>
            <li onClick={() => sortCards('oldest')}>Date Created (Oldest First)</li>
            <li onClick={() => sortCards('alphabetical')}>Card Name (Alphabetically)</li>
          </ul>
        </button>
      </div>
      <div className="card-list">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <h3>{card.name}</h3>
            <p>{card.dateCreated.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketing;
