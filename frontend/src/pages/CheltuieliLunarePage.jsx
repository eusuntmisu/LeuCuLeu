import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPlatiSincronizate, proiectii } from "../recurente.js";
import { ETICHETE_FRECVENTA } from "../constants.js";
import GraficLunar from "../components/GraficLunar.jsx";
import { decaleazaLuna, formatRon, numeLuna, totaluriLuna } from "../lunaHelper.js";
import styles from "./CheltuieliLunarePage.module.css";

const MODURI_COMPARATIE = [
  { value: "anterioara", label: "Luna trecută", delta: -1 },
  { value: "an", label: "Aceeași lună, anul trecut", delta: -12 },
];

function Diferenta({ curent, anterior, fataDe }) {
  const dif = curent - anterior;
  if (Math.abs(dif) < 0.005) return <span className={styles.deltaZero}>= la fel ca {fataDe}</span>;
  const procent = anterior > 0 ? ` (${dif > 0 ? "+" : ""}${Math.round((dif / anterior) * 100)}%)` : "";
  return (
    <span className={dif > 0 ? styles.deltaUp : styles.deltaDown} title={`față de ${fataDe}`}>
      {dif > 0 ? "▲ +" : "▼ −"}
      {formatRon(Math.abs(dif))}
      {procent}
    </span>
  );
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
  const [modComparatie, setModComparatie] = useState("anterioara");

  useEffect(() => {
    let ignore = false;
    fetchPlatiSincronizate()
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

  // platile salvate + urmatoarea plata previzionata a fiecarui abonament activ
  const toate = [...plati, ...proiectii(plati)];
  const luni = [...new Set(toate.map((p) => p.data.slice(0, 7)))].sort();
  const luna = lunaSelectata || lunaImplicita(luni);
  const platiLuna = toate
    .filter((p) => p.data.startsWith(luna))
    .sort((a, b) => a.data.localeCompare(b.data));

  const abonamenteActive = platiLuna.filter((p) => p.tip === "abonament" && !p.anulat);
  const unice = platiLuna.filter((p) => p.tip === "onetime");
  const anulate = platiLuna.filter((p) => p.tip === "abonament" && p.anulat);

  const suma = (lista) => lista.reduce((total, p) => total + p.suma, 0);
  const totalAbonamente = suma(abonamenteActive);
  const totalUnice = suma(unice);
  const totalEconomisit = suma(anulate);

  const mod = MODURI_COMPARATIE.find((m) => m.value === modComparatie);
  const lunaComparata = luna ? decaleazaLuna(luna, mod.delta) : "";
  const curent = { abonamente: totalAbonamente, unice: totalUnice, total: totalAbonamente + totalUnice };
  const comparat = luna ? totaluriLuna(toate, lunaComparata) : null;

  const areComparatie = comparat && comparat.total > 0;
  const lunaScurta = luna ? numeLuna(luna).slice(0, 3).toLowerCase() : "";

  const statistici = [
    { cheie: "total", eticheta: `Total ${numeLuna(luna || "0000-01")}`, valoare: curent.total, testid: "month-total" },
    { cheie: "abonamente", eticheta: "Abonamente active", valoare: curent.abonamente },
    { cheie: "unice", eticheta: "Cheltuieli unice", valoare: curent.unice },
  ];

  return (
    <section className="panel">
      <div className={styles.header}>
        <h2>Cheltuieli pe lună</h2>
        {luni.length > 0 && (
          <div className={styles.controls}>
            <label className={styles.picker}>
              <span className={styles.srOnly}>Luna</span>
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
            <div className={styles.toggle} role="group" aria-label="Compară cu">
              {MODURI_COMPARATIE.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={m.value === modComparatie ? styles.toggleActive : ""}
                  aria-pressed={m.value === modComparatie}
                  onClick={() => setModComparatie(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
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
          <div className={styles.stats} data-testid="month-compare">
            {statistici.map((s) => (
              <div key={s.cheie} className={`${styles.stat} ${s.cheie === "total" ? styles.total : ""}`}>
                <span className={styles.statLabel}>{s.eticheta}</span>
                <strong className={styles.statValue} data-testid={s.testid}>
                  {formatRon(s.valoare)}
                </strong>
                <span className={styles.statDelta}>
                  {areComparatie ? (
                    <Diferenta curent={s.valoare} anterior={comparat[s.cheie]} fataDe={numeLuna(lunaComparata)} />
                  ) : (
                    <span className={styles.deltaZero}>fără date în {numeLuna(lunaComparata)}</span>
                  )}
                </span>
              </div>
            ))}
            <div className={styles.stat}>
              <span className={styles.statLabel}>Economisit prin anulare</span>
              <strong className={`${styles.statValue} ${styles.saved}`}>{formatRon(totalEconomisit)}</strong>
              <span className={styles.statDelta}>
                <span className={styles.deltaZero}>
                  {anulate.length} {anulate.length === 1 ? "abonament anulat" : "abonamente anulate"}
                </span>
              </span>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ultimele 13 luni</h3>
            <GraficLunar
              plati={toate}
              luna={luna}
              lunaComparata={lunaComparata}
              luniCuDate={luni}
              onSelect={setLunaSelectata}
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Tranzacții <span className={styles.count}>{platiLuna.length}</span>
            </h3>
            <ul className={styles.list}>
              {platiLuna.map((p) => {
                const anulat = p.tip === "abonament" && p.anulat;
                let clasa = styles.row;
                if (anulat) clasa = `${styles.row} ${styles.cancelled}`;
                else if (p.proiectie) clasa = `${styles.row} ${styles.forecast}`;
                return (
                  <li key={p.id} className={clasa}>
                    <span className={styles.date}>
                      <b>{p.data.slice(8, 10)}</b>
                      <small>{lunaScurta}</small>
                    </span>
                    <Link to={`/plati/${p.sursaId ?? p.id}`} className={styles.name}>
                      {p.nume}
                    </Link>
                    {p.proiectie && (
                      <span className={styles.forecastTag} title="Se salvează automat când îi vine data">
                        Previzionat
                      </span>
                    )}
                    <span className={`badge badge-${p.frecventa}`}>{ETICHETE_FRECVENTA[p.frecventa]}</span>
                    <span className={styles.amount}>{formatRon(p.suma)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
