import PlataCard from "./PlataCard.jsx";

export default function PlataList({ plati, onToggle, onDelete }) {
  if (plati.length === 0) {
    return <p className="empty">Nu există nicio tranzacție înregistrată.</p>;
  }

  return (
    <ul className="item-list">
      {plati.map((plata) => (
        <PlataCard 
          key={plata.id} 
          plata={plata} 
          onToggle={onToggle} 
          onDelete={onDelete} 
        />
      ))}
    </ul>
  );
}