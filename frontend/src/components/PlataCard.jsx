import { Link } from "react-router-dom";
import { ETICHETE_FRECVENTA } from "../constants.js";
import styles from "./PlataCard.module.css";

export default function PlataCard({ plata, onToggle, onDelete }) {
  const cardClass = plata.finalizat ? `${styles.card} ${styles.done}` : styles.card;

  let textStatus = "Activ";
  if (plata.finalizat) {
    textStatus = plata.tip === "abonament" ? "Anulat" : "Plătit";
  }

  return (
    <li className={cardClass} data-testid="item" data-id={plata.id}>
      <div className={styles.main}>
        <input
          type="checkbox"
          checked={plata.finalizat}
          onChange={() => onToggle(plata.id)}
          aria-label={`Marchează ${plata.nume}`}
          data-testid="item-toggle"
        />
        <div>
          <div className={styles.titleRow}>
            <Link to={`/plati/${plata.id}`} className={styles.title} data-testid="item-link">
              {plata.nume}
            </Link>
            <span className={styles.price}>{plata.suma} RON</span>
          </div>
          <span className={`badge badge-${plata.frecventa}`}>
            {ETICHETE_FRECVENTA[plata.frecventa]}
          </span>
          <span className={styles.date}>{plata.data}</span>
        </div>
      </div>

      <span className={styles.status}>{textStatus}</span>

      <button
        className="btn-danger"
        onClick={() => onDelete(plata.id)}
        aria-label={`Șterge tranzacția ${plata.nume}`}
        data-testid="item-delete"
      >
        Șterge
      </button>
    </li>
  );
}
