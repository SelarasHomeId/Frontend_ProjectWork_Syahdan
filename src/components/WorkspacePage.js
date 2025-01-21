import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function WorkspacePage() {
  const { division } = useParams();  // Mengambil parameter division dari URL
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

  // Fungsi untuk mengurutkan kartu berdasarkan tanggal
  const sortByDate = () => {
    const sortedCards = [...cards].sort((a, b) => b.createdAt - a.createdAt);
    setCards(sortedCards);
  };

  return (
    <div>
      <h2>{division} Workspace</h2>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Actions
        </button>
        <ul className="dropdown-menu">
          <li>
            <a className="dropdown-item" href="#" onClick={addCard}>
              Add Card
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" onClick={moveList}>
              Move List
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" onClick={copyList}>
              Copy List
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" onClick={moveAllCards}>
              Move All Cards in This List
            </a>
          </li>
        </ul>
      </div>
      
      <div className="mt-4">
        <h5>Card List for {division}</h5>
        {cards.length === 0 ? (
          <p>No cards available for this division.</p>
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

export default WorkspacePage;
