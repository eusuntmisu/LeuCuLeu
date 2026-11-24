import { useState } from "react";
import { FRECVENTE, LUNI, TIPURI } from "../constants.js";
import styles from "./PlataForm.module.css";

const NUME_MAX = 100;
const SUMA_MAX = 1000000;
const AN_MIN = 2020;
const AN_MAX = 2030;

export default function PlataForm({ onAscunde, onAdd }) {
  const [nume, setNume] = useState("");
  const [tip, setTip] = useState("abonament");
  const [frecventa, setFrecventa] = useState("lunar");
  const [suma, setSuma] = useState("");
  const [zi, setZi] = useState(() => String(new Date().getDate()));
  const [luna, setLuna] = useState(() => String(new Date().getMonth() + 1).padStart(2, "0"));
  const [an, setAn] = useState(() => String(new Date().getFullYear()));

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
    e.preventDefault();
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
        anulat: false,
      });
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
    <section className={`panel ${styles.sticky}`}>
      <div className={styles.header}>
        <h2>Adaugă tranzacție</h2>
        <button type="button" className="icon-btn" onClick={onAscunde} title="Ascunde panoul">
          ⬅
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate data-testid="form">
        <label>Tip tranzacție
          <select value={tip} onChange={handleTipChange} data-testid="form-tip">
            {TIPURI.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
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
          <div className={styles.datePicker}>
            <input type="number" className={styles.day} placeholder="Zi" min="1" max="31" value={zi} onChange={(e) => setZi(e.target.value)} aria-label="Ziua" />
            <select className={styles.month} value={luna} onChange={(e) => setLuna(e.target.value)} aria-label="Luna">
              {LUNI.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <input type="number" className={styles.year} placeholder="An" min={AN_MIN} max={AN_MAX} value={an} onChange={(e) => setAn(e.target.value)} aria-label="Anul" />
          </div>
        </label>

        <label>Frecvență (Doar pt. abonamente)
          <select
            value={frecventa}
            onChange={(e) => setFrecventa(e.target.value)}
            disabled={tip === "onetime"}
            data-testid="form-frecventa"
          >
            {FRECVENTE.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
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

        <button type="submit" className="btn" disabled={trimite} data-testid="form-submit">
          {trimite ? "Se salvează..." : "Adaugă"}
        </button>
      </form>
    </section>
  );
}
