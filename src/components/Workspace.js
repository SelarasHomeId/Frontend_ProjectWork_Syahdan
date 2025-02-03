import React, { useState } from 'react';

function Workspace({workspaceName}) {
  const [cards, setCards] = useState([]);

  // Fungsi untuk menambahkan kartu baru
  const addCard = () => {
    const newCard = { id: cards.length + 1, title: `Card ${cards.length + 1}`, createdAt: new Date() };
    setCards([...cards, newCard]);
  };

  // Fungsi untuk memindahkan kartu pertama ke akhir
  const moveList = () => {
    const movedCards = [...cards];
    movedCards.push(movedCards.shift()); // Memindahkan kartu pertama ke akhir
    setCards(movedCards);
  };

  // Fungsi untuk menyalin kartu
  const copyList = () => {
    const copiedCards = [...cards];
    setCards([...cards, ...copiedCards]); // Menambahkan salinan kartu ke dalam daftar
  };

  // Fungsi untuk memindahkan semua kartu ke tempat lain (misalnya menghapus semua kartu)
  const moveAllCards = () => {
    setCards([]); // Menghapus semua kartu
  };

  return (
    <div>
      <h2 className='text-center'>{workspaceName} Workspace</h2>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          Actions
        </button>
        <ul className="dropdown-menu">
          <li>
            <div className="dropdown-item" onClick={addCard}>
              Add Card
            </div>
          </li>
          <li>
            <div className="dropdown-item" onClick={moveList}>
              Move List
            </div>
          </li>
          <li>
            <div className="dropdown-item" onClick={copyList}>
              Copy List
            </div>
          </li>
          <li>
            <div className="dropdown-item" onClick={moveAllCards}>
              Move All Cards in This List
            </div>
          </li>
        </ul>
      </div>
      
      <div className="mt-4">
        <h5>Card List for {workspaceName}</h5>
        {cards.length === 0 ? (
          <p>No cards available for this workspaceName.</p>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="text-muted">Created At: {card.createdAt.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Workspace;
