import { useState } from "react";

export default function PlataForm({ onAscunde }) {
  const [tip, setTip] = useState("abonament");
  const [frecventa, setFrecventa] = useState("lunar");
  
  const [zi, setZi] = useState("29");
  const [luna, setLuna] = useState("09");
  const [an, setAn] = useState("2026");

  const handleTipChange = (e) => {
    const noulTip = e.target.value;
    setTip(noulTip);
    if (noulTip === "onetime") {
      setFrecventa("none");
    } else {
      setFrecventa("lunar");
    }
  };

  return (
    <section className="panel sticky-panel">
      <div className="form-header">
        <h2>Adaugă tranzacție</h2>
        <button type="button" className="icon-btn" onClick={onAscunde} title="Ascunde panoul">
          ⬅
        </button>
      </div>

      <form className="item-form">
        <label>Tip tranzacție
          <select name="tip_tranzactie" value={tip} onChange={handleTipChange}>
            <option value="abonament">Abonament (Recurent)</option>
            <option value="onetime">Cheltuială unică (One-time)</option>
          </select>
        </label>

        <label>Nume / Descriere 
          <input type="text" name="nume" placeholder="Ex: Netflix..." required />
        </label>
        
        <label>Data scadenței
          <div className="custom-date-picker">
            <input 
              type="number" 
              className="date-day" 
              placeholder="Zi" 
              min="1" 
              max="31" 
              value={zi}
              onChange={(e) => setZi(e.target.value)}
              required 
            />
            <select 
              className="date-month"
              value={luna}
              onChange={(e) => setLuna(e.target.value)}
            >
              <option value="01">Ianuarie</option>
              <option value="02">Februarie</option>
              <option value="03">Martie</option>
              <option value="04">Aprilie</option>
              <option value="05">Mai</option>
              <option value="06">Iunie</option>
              <option value="07">Iulie</option>
              <option value="08">August</option>
              <option value="09">Septembrie</option>
              <option value="10">Octombrie</option>
              <option value="11">Noiembrie</option>
              <option value="12">Decembrie</option>
            </select>
            <input 
              type="number" 
              className="date-year" 
              placeholder="An" 
              min="2005" 
              max="2030" 
              value={an}
              onChange={(e) => setAn(e.target.value)}
              required 
            />
          </div>
        </label>

        <label>Frecvență (Doar pt. abonamente)
          <select 
            name="frecventa" 
            value={frecventa} 
            onChange={(e) => setFrecventa(e.target.value)}
            disabled={tip === "onetime"}
          >
            <option value="lunar">Lunar</option>
            <option value="trimestrial">Trimestrial</option>
            <option value="anual">Anual</option>
            <option value="none">- Nu se aplică -</option>
          </select>
        </label>

        <label>Sumă (RON)
          <input type="number" name="pret" placeholder="Ex: 50" min="0" step="0.01" required />
        </label>

        <button type="submit">Adaugă</button>
      </form>
    </section>
  );
}