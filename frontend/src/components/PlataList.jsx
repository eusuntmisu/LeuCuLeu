import PlataCard from "./PlataCard.jsx";
import styles from "./PlataList.module.css";

export default function PlataList({ plati, urmatoare = {}, onToggle, onCancel, onDelete }) {
  if (plati.length === 0) {
    return (
      <p className="empty" data-testid="empty">
        Nu există nicio tranzacție înregistrată.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {plati.map((plata) => (
        <PlataCard
          key={plata.id}
          plata={plata}
          urmatoarea={urmatoare[plata.id]}
          onToggle={onToggle}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
