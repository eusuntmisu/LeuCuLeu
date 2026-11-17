import { useState } from "react";

const NUME_MAX = 100;
const SUMA_MAX = 1000000;
const AN_MIN = 2020;
const AN_MAX = 2030;

const LUNI = [
  { value: "01", label: "Ianuarie" },
  { value: "02", label: "Februarie" },
  { value: "03", label: "Martie" },
  { value: "04", label: "Aprilie" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Iunie" },
  { value: "07", label: "Iulie" },
  { value: "08", label: "August" },
  { value: "09", label: "Septembrie" },
  { value: "10", label: "Octombrie" },
  { value: "11", label: "Noiembrie" },
  { value: "12", label: "Decembrie" },
];

// Formular controlat: state-ul React este sursa de adevăr pentru câmpuri
export default function PlataForm({ onAscunde, onAdd }) {
  const [nume, setNume] = useState("");
  const [tip, setTip] = useState("abonament");
  const [frecventa, setFrecventa] = useState("lunar");
  const [suma, setSuma] = useState("");
  const [zi, setZi] = useState("29");
  const [luna, setLuna] = useState("09");
  const [an, setAn] = useState("2026");

  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  function handleTipChange(e) {
    const noulTip = e.target.value;
    setTip(noulTip);
    if (noulTip === "onetime") {
      setFrecventa("none");
    } else if (frecventa === "none") {
      setFrecventa("lunar");
    }
  }

  function valideaza() {
    const n = nume.trim();
    if (n === "") return "Numele este obligatoriu.";
    if (n.length > NUME_MAX) return `Numele are maximum ${NUME_MAX} de caractere.`;

    const s = Number(suma);
    if (suma === "" || Number.isNaN(s)) return "Suma este obligatorie.";
    if (s <= 0) return "Suma trebuie să fie un număr pozitiv.";
    if (s > SUMA_MAX) return `Suma poate fi de maximum ${SUMA_MAX} RON.`;

    const a = Number(an);
    if (!Number.isInteger(a) || a < AN_MIN || a > AN_MAX) {
      return `Anul trebuie să fie între ${AN_MIN} și ${AN_MAX}.`;
    }
    const z = Number(zi);
    const zileInLuna = new Date(a, Number(luna), 0).getDate();
    if (!Number.isInteger(z) || z < 1 || z > zileInLuna) {
      return `Ziua trebuie să fie între 1 și ${zileInLuna} pentru luna aleasă.`;
    }

    if (tip === "abonament" && frecventa === "none") {
      return "Alege frecvența abonamentului.";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault(); // oprește reîncărcarea paginii
    const mesaj = valideaza();
    if (mesaj) {
      setEroare(mesaj);
      return;
    }
    setEroare("");
    setTrimite(true);
    try {
      await onAdd({
        nume: nume.trim(),
        tip,
        frecventa: tip === "onetime" ? "none" : frecventa,
        suma: Number(suma),
        data: `${an}-${luna}-${String(zi).padStart(2, "0")}`,
        finalizat: false,
      });
      // golirea se face doar dacă salvarea a reușit
      setNume("");
      setSuma("");
      setTip("abonament");
      setFrecventa("lunar");
    } catch (err) {
      setEroare(err.message);
    } finally {
      setTrimite(false);
    }
  }

  return (
    <section className="panel sticky-panel">
      <div className="form-header">
        <h2>Adaugă tranzacție</h2>
        <button type="button" className="icon-btn" onClick={onAscunde} title="Ascunde panoul">
          ⬅
        </button>
      </div>

      <form className="item-form" onSubmit={handleSubmit} noValidate data-testid="form">
        <label>Tip tranzacție
          <select value={tip} onChange={handleTipChange} data-testid="form-tip">
            <option value="abonament">Abonament (Recurent)</option>
            <option value="onetime">Cheltuială unică (One-time)</option>
          </select>
        </label>

        <label>Nume / Descriere
          <input
            type="text"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            placeholder="Ex: Netflix..."
            maxLength={NUME_MAX}
            aria-invalid={Boolean(eroare)}
            data-testid="form-title"
          />
        </label>

        <label>Data scadenței
          <div className="custom-date-picker">
            <input type="number" className="date-day" placeholder="Zi" min="1" max="31" value={zi} onChange={(e) => setZi(e.target.value)} />
            <select className="date-month" value={luna} onChange={(e) => setLuna(e.target.value)}>
              {LUNI.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <input type="number" className="date-year" placeholder="An" min={AN_MIN} max={AN_MAX} value={an} onChange={(e) => setAn(e.target.value)} />
          </div>
        </label>

        <label>Frecvență (Doar pt. abonamente)
          <select
            value={frecventa}
            onChange={(e) => setFrecventa(e.target.value)}
            disabled={tip === "onetime"}
            data-testid="form-frecventa"
          >
            <option value="lunar">Lunar</option>
            <option value="trimestrial">Trimestrial</option>
            <option value="anual">Anual</option>
            <option value="none">- Nu se aplică -</option>
          </select>
        </label>

        <label>Sumă (RON)
          <input
            type="number"
            value={suma}
            onChange={(e) => setSuma(e.target.value)}
            placeholder="Ex: 50"
            min="0"
            step="0.01"
            data-testid="form-suma"
          />
        </label>

        {eroare && (
          <p className="error" data-testid="form-error">
            {eroare}
          </p>
        )}

        <button type="submit" disabled={trimite} data-testid="form-submit">
          {trimite ? "Se salvează..." : "Adaugă"}
        </button>
      </form>
    </section>
  );
}
