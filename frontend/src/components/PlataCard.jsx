import { Link } from "react-router-dom";
import { ETICHETE_FRECVENTA } from "../constants.js";
import { ETICHETE_STATUS, statusPlata } from "../lunaHelper.js";
import styles from "./PlataCard.module.css";

export default function PlataCard({ plata, urmatoarea, onToggle, onCancel, onDelete }) {
  const esteAbonament = plata.tip === "abonament";
  const status = statusPlata(plata);
  const cardClass = status === "anulat" ? `${styles.card} ${styles.cancelled}` : styles.card;

  return (
    <li className={cardClass} data-testid="item" data-id={plata.id}>
      <div className={styles.main}>
        <label className={styles.paid} title={plata.anulat ? "Abonamentul e anulat" : "Bifează când ai plătit"}>
          <input
            type="checkbox"
            checked={plata.finalizat}
            disabled={plata.anulat}
            onChange={() => onToggle(plata.id)}
            aria-label={`Marchează ${plata.nume} ca plătit`}
            data-testid="item-toggle"
          />
          <span>Plătit</span>
        </label>
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
          {urmatoarea && (
            <span className={styles.next} data-testid="item-next">
              Următoarea plată: {urmatoarea}
            </span>
          )}
        </div>
      </div>

      <span className={`${styles.status} ${styles[status]}`} data-testid="item-status">
        {status === "platit" && "✓ "}
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
