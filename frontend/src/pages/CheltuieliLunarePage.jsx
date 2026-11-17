import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPlati } from "../api.js";
import { ETICHETE_FRECVENTA, LUNI } from "../constants.js";
import styles from "./CheltuieliLunarePage.module.css";

function formatRon(valoare) {
  return `${valoare.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} RON`;
}

function numeLuna(anLuna) {
  const [an, luna] = anLuna.split("-");
  const gasita = LUNI.find((l) => l.value === luna);
  return `${gasita ? gasita.label : luna} ${an}`;
}

function lunaImplicita(luni) {
  const azi = new Date();
  const curenta = `${azi.getFullYear()}-${String(azi.getMonth() + 1).padStart(2, "0")}`;
  if (luni.includes(curenta)) return curenta;
  return luni[0] ?? "";
}

export default function CheltuieliLunarePage() {
  const [plati, setPlati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lunaSelectata, setLunaSelectata] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchPlati()
      .then((data) => {
        if (!ignore) setPlati(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const luni = [...new Set(plati.map((p) => p.data.slice(0, 7)))].sort();
  const luna = lunaSelectata || lunaImplicita(luni);
  const platiLuna = plati
    .filter((p) => p.data.startsWith(luna))
    .sort((a, b) => a.data.localeCompare(b.data));

  const abonamenteActive = platiLuna.filter((p) => p.tip === "abonament" && !p.finalizat);
  const unice = platiLuna.filter((p) => p.tip === "onetime");
  const anulate = platiLuna.filter((p) => p.tip === "abonament" && p.finalizat);

  const suma = (lista) => lista.reduce((total, p) => total + p.suma, 0);
  const totalAbonamente = suma(abonamenteActive);
  const totalUnice = suma(unice);
  const totalEconomisit = suma(anulate);

  return (
    <section className="panel">
      <div className={styles.header}>
        <h2>Cheltuieli pe lună</h2>
        {luni.length > 0 && (
          <label className={styles.picker}>
            Luna
            <select
              value={luna}
              onChange={(e) => setLunaSelectata(e.target.value)}
              data-testid="month-select"
            >
              {luni.map((l) => (
                <option key={l} value={l}>
                  {numeLuna(l)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loading && <p className="info" data-testid="loading">Se încarcă cheltuielile...</p>}

      {error && (
        <div className="error" data-testid="error">
          A apărut o eroare: {error}.
        </div>
      )}

      {!loading && !error && luni.length === 0 && (
        <p className="empty" data-testid="empty">Nu există nicio tranzacție înregistrată.</p>
      )}

      {!loading && !error && luni.length > 0 && (
        <>
          <div className={styles.stats}>
            <div className={`${styles.stat} ${styles.total}`}>
              <span className={styles.statLabel}>Total {numeLuna(luna)}</span>
              <strong data-testid="month-total">{formatRon(totalAbonamente + totalUnice)}</strong>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Abonamente active</span>
              <strong>{formatRon(totalAbonamente)}</strong>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Cheltuieli unice</span>
              <strong>{formatRon(totalUnice)}</strong>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Economisit prin anulare</span>
              <strong className={styles.saved}>{formatRon(totalEconomisit)}</strong>
            </div>
          </div>

          <ul className={styles.list}>
            {platiLuna.map((p) => {
              const anulat = p.tip === "abonament" && p.finalizat;
              return (
                <li key={p.id} className={anulat ? `${styles.row} ${styles.cancelled}` : styles.row}>
                  <span className={styles.date}>{p.data.slice(8, 10)}</span>
                  <Link to={`/plati/${p.id}`} className={styles.name}>
                    {p.nume}
                  </Link>
                  <span className={`badge badge-${p.frecventa}`}>{ETICHETE_FRECVENTA[p.frecventa]}</span>
                  <span className={styles.amount}>{formatRon(p.suma)}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
