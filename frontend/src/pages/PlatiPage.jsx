import { useEffect, useState } from "react";
import PlataList from "../components/PlataList.jsx";
import PlataForm from "../components/PlataForm.jsx";
import { createPlata, deletePlata } from "../api.js";
import { comutaAnulare, confirmaAnularea, fetchPlatiSincronizate, platiUlterioare } from "../recurente.js";
import { statusPlata } from "../lunaHelper.js";
import { LUNI } from "../constants.js";
import styles from "./PlatiPage.module.css";

export default function PlatiPage() {
  const [plati, setPlati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtruTip, setFiltruTip] = useState("all");
  const [filtruLuna, setFiltruLuna] = useState("all");
  const [filtruAn, setFiltruAn] = useState("all");
  const [arataFormular, setArataFormular] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await fetchPlatiSincronizate();
        if (!ignore) setPlati(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleAddPlata(nouaPlata) {
    await createPlata(nouaPlata);
    // un abonament adaugat cu data din trecut primeste imediat urmatoarele plati
    setPlati(await fetchPlatiSincronizate());
  }

  async function handleCancel(id) {
    const plata = plati.find((p) => p.id === id);
    if (!plata.anulat && !confirmaAnularea(plata, platiUlterioare(plata, plati).length)) return;
    try {
      setPlati(await comutaAnulare(plata));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePlata(id);
      setPlati((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const ani = [...new Set(plati.map((p) => p.data.slice(0, 4)))].sort();

  const platiFiltrate = plati.filter((p) => {
    const [an, luna] = p.data.split("-");
    if (filtruTip !== "all" && p.tip !== filtruTip) return false;
    if (filtruLuna !== "all" && luna !== filtruLuna) return false;
    if (filtruAn !== "all" && an !== filtruAn) return false;
    return true;
  });

  const filtreActive = filtruTip !== "all" || filtruLuna !== "all" || filtruAn !== "all";
  const urmeaza = platiFiltrate.filter((p) => statusPlata(p) === "urmeaza").length;

  function resetFiltre() {
    setFiltruTip("all");
    setFiltruLuna("all");
    setFiltruAn("all");
  }

  return (
    <div className={arataFormular ? styles.grid : `${styles.grid} ${styles.fullWidth}`}>
      {arataFormular && (
        <PlataForm onAscunde={() => setArataFormular(false)} onAdd={handleAddPlata} />
      )}

      <section className="panel">
        {!arataFormular && (
          <button
            className={`icon-btn ${styles.showFormBtn}`}
            onClick={() => setArataFormular(true)}
            title="Arată panoul de adăugare"
          >
            ➔
          </button>
        )}

        <div className={styles.listHeader}>
          <h2>Istoric tranzacții</h2>
          <div className={styles.filterGroup}>
            <select
              value={filtruTip}
              onChange={(e) => setFiltruTip(e.target.value)}
              aria-label="Filtrează după tip"
              data-testid="filter-tip"
            >
              <option value="all">Toate tipurile</option>
              <option value="abonament">Abonamente</option>
              <option value="onetime">Cheltuieli unice</option>
            </select>
            <select
              value={filtruLuna}
              onChange={(e) => setFiltruLuna(e.target.value)}
              aria-label="Filtrează după lună"
              data-testid="filter-luna"
            >
              <option value="all">Toate lunile</option>
              {LUNI.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <select
              value={filtruAn}
              onChange={(e) => setFiltruAn(e.target.value)}
              aria-label="Filtrează după an"
              data-testid="filter-an"
            >
              <option value="all">Toți anii</option>
              {ani.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <p className={styles.summary}>
          {filtreActive
            ? `${platiFiltrate.length} din ${plati.length} tranzacții, dintre care ${urmeaza} urmează`
            : `${plati.length} tranzacții, dintre care ${urmeaza} urmează`}
          {filtreActive && (
            <button type="button" className={styles.reset} onClick={resetFiltre}>
              Șterge filtrele
            </button>
          )}
        </p>

        {loading && <p className="info" data-testid="loading">Se încarcă istoricul de plăți...</p>}

        {error && (
          <div className="error" data-testid="error">
            A apărut o eroare: {error}.<br />
            Serverul local rulează? Ai dat <code>npm run api</code> în al doilea terminal?
          </div>
        )}

        {!loading && filtreActive && plati.length > 0 && platiFiltrate.length === 0 && (
          <p className="empty">Nicio tranzacție nu se potrivește cu filtrele alese.</p>
        )}

        {!loading && !(filtreActive && plati.length > 0 && platiFiltrate.length === 0) && (
          <PlataList
            plati={platiFiltrate}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}
