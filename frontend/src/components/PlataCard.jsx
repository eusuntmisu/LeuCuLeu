const ETICHETE_FRECVENTA = { lunar: "Abonament Lunar", trimestrial: "Trimestrial", anual: "Anual", none: "One-time" };

export default function PlataCard({ plata, onToggle, onDelete }) {
  const cardClass = plata.activ ? "item-card" : "item-card done";
  const badgeClass = `badge badge-${plata.frecventa}`;

  let textStatus = "Activ";
  if (!plata.activ) {
    textStatus = plata.tip === "abonament" ? "Anulat" : "Plătit";
  }

  return (
    <li className={cardClass}>
      
      <label className="task-main">
        <input 
          type="checkbox" 
          checked={!plata.activ} 
          onChange={() => onToggle(plata.id)} 
        />
        <div className="item-details">
          <h3>{plata.nume} <span className="price-tag">{plata.suma} RON</span></h3>
          <span className={badgeClass}>{ETICHETE_FRECVENTA[plata.frecventa]}</span>
          <span className="category-text">{plata.data}</span>
        </div>
      </label>

      <span className="status">{textStatus}</span>

      <button 
        className="btn-danger" 
        onClick={() => onDelete(plata.id)}
        aria-label={`Șterge tranzacția ${plata.nume}`}
      >
        Șterge
      </button>

    </li>
  );
}