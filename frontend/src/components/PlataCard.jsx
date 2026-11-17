const ETICHETE_FRECVENTA = { lunar: "Abonament Lunar", trimestrial: "Trimestrial", anual: "Anual", none: "One-time" };

export default function PlataCard({ plata, onToggle, onDelete }) {
  const cardClass = plata.finalizat ? "item-card done" : "item-card";
  const badgeClass = `badge badge-${plata.frecventa}`;

  let textStatus = "Activ";
  if (plata.finalizat) {
    textStatus = plata.tip === "abonament" ? "Anulat" : "Plătit";
  }

  return (
    <li className={cardClass} data-testid="item" data-id={plata.id}>
      <label className="task-main">
        <input
          type="checkbox"
          checked={plata.finalizat}
          onChange={() => onToggle(plata.id)}
          data-testid="item-toggle"
        />
        <div className="item-details">
          <h3>
            <span data-testid="item-title">{plata.nume}</span>{" "}
            <span className="price-tag">{plata.suma} RON</span>
          </h3>
          <span className={badgeClass}>{ETICHETE_FRECVENTA[plata.frecventa]}</span>
          <span className="category-text">{plata.data}</span>
        </div>
      </label>

      <span className="status">{textStatus}</span>

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
