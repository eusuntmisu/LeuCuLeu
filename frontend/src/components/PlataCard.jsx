import { Link } from "react-router-dom";
import { ETICHETE_FRECVENTA } from "../constants.js";
import { ETICHETE_STATUS, statusPlata } from "../lunaHelper.js";
import styles from "./PlataCard.module.css";

export default function PlataCard({ plata, onCancel, onDelete }) {
  const esteAbonament = plata.tip === "abonament";
  const status = statusPlata(plata);
  const cardClass = status === "anulat" ? `${styles.card} ${styles.cancelled}` : styles.card;

  return (
    <li className={cardClass} data-testid="item" data-id={plata.id}>
      <div className={styles.main}>
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

      <span className={`${styles.status} ${styles[status]}`} data-testid="item-status">
        {status === "platit" && "✓ "}
        {status === "urmeaza" && "⏳ "}
        {ETICHETE_STATUS[status]}
      </span>

      {esteAbonament && (
        <button
          className={styles.cancelBtn}
          onClick={() => onCancel(plata.id)}
          aria-label={`${plata.anulat ? "Reactivează" : "Anulează"} abonamentul ${plata.nume}`}
          data-testid="item-cancel"
        >
          {plata.anulat ? "Reactivează" : "Anulează"}
        </button>
      )}

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
