const ETICHETE_FRECVENTA = { 
  lunar: "Abonament Lunar", 
  trimestrial: "Abonament Trimestrial",
  anual: "Abonament Anual", 
  none: "One-time" 
};

export default function PlataCard({ plata }) {
  const cardClass = plata.activ ? "item-card" : "item-card done";
  
  const badgeClass = `badge badge-${plata.frecventa}`;

  let textStatus = "Activ";
  if (!plata.activ) {
    textStatus = plata.tip === "abonament" ? "Anulat" : "Plătit";
  }

  return (
    <li className={cardClass}>
      <div className="item-details">
        <h3>{plata.nume} <span className="price-tag">{plata.suma} RON</span></h3>
        <span className={badgeClass}>{ETICHETE_FRECVENTA[plata.frecventa]}</span>
        <span className="category-text">{plata.data}</span>
      </div>
      <span className="status">{textStatus}</span>
    </li>
  );
}