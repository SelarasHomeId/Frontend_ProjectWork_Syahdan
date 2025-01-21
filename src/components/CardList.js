// CardList.js
import React from 'react';

function CardList({ divisiName }) {
  const cards = [
    { id: 1, name: 'Card 1', dateCreated: '2025-01-01' },
    { id: 2, name: 'Card 2', dateCreated: '2025-01-02' },
    { id: 3, name: 'Card 3', dateCreated: '2025-01-03' },
  ];

  return (
    <div className="card-list">
      <h3>Card List for {divisiName}</h3>
      <div className="card-list-container">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <h5>{card.name}</h5>
            <p>Date Created: {card.dateCreated}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardList;
