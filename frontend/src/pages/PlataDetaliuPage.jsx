import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePlata, fetchPlata, fetchPlati } from "../api.js";
import { comutaAnulare, confirmaAnularea, platiUlterioare } from "../recurente.js";
import { ETICHETE_FRECVENTA, ETICHETE_TIP, PLATI_PE_AN } from "../constants.js";
import { ETICHETE_STATUS, statusPlata } from "../lunaHelper.js";
import styles from "./PlataDetaliuPage.module.css";

function formatRon(valoare) {
  return `${valoare.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} RON`;
}

export default function PlataDetaliuPage() {
  const { id } = useParams();
  const [plata, setPlata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eroareActiune, setEroareActiune] = useState(null);
  const [seLucreaza, setSeLucreaza] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    fetchPlata(id)
      .then((data) => {
        if (!ignore) {
          setPlata(data);
          setError(null);
        }
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
  }, [id]);

  if (loading) {
    return (
      <p className="info" data-testid="loading">
        Se încarcă tranzacția...
      </p>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <p className="error" data-testid="error">
          Tranzacția nu a putut fi încărcată: {error}
        </p>
        <Link to="/">Înapoi la listă</Link>
      </section>
    );
  }

  const esteAbonament = plata.tip === "abonament";
  const status = ETICHETE_STATUS[statusPlata(plata)];

  async function handleCancel() {
    setSeLucreaza(true);
    setEroareActiune(null);
    try {
      if (!plata.anulat) {
        const ulterioare = platiUlterioare(plata, await fetchPlati()).length;
        if (!confirmaAnularea(plata, ulterioare)) return;
      }
      const toate = await comutaAnulare(plata);
      setPlata(toate.find((p) => p.id === plata.id) ?? { ...plata, anulat: !plata.anulat });
    } catch (err) {
      setEroareActiune(err.message);
    } finally {
      setSeLucreaza(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Ștergi definitiv „${plata.nume}” din ${plata.data}?`)) return;
    setSeLucreaza(true);
    setEroareActiune(null);
    try {
      await deletePlata(plata.id);
      navigate("/");
    } catch (err) {
      setEroareActiune(err.message);
      setSeLucreaza(false);
    }
  }

  return (
    <section className={`panel ${styles.detail}`} data-testid="detail">
      <Link to="/" className={styles.back}>
        ← Înapoi la listă
      </Link>

      <h2 className={esteAbonament && plata.anulat ? styles.done : undefined} data-testid="detail-title">
        {plata.nume}
      </h2>
      <p className={styles.amount}>{formatRon(plata.suma)}</p>

      <dl className={styles.fields}>
        <dt>Tip</dt>
        <dd>{ETICHETE_TIP[plata.tip] ?? plata.tip}</dd>

        <dt>Frecvență</dt>
        <dd>
          <span className={`badge badge-${plata.frecventa}`}>
            {ETICHETE_FRECVENTA[plata.frecventa]}
          </span>
        </dd>

        <dt>Data scadenței</dt>
        <dd>{plata.data}</dd>

        <dt>Status</dt>
        <dd>{status}</dd>

        {esteAbonament && (
          <>
            <dt>Cost anual estimat</dt>
            <dd>
              {formatRon(plata.suma * PLATI_PE_AN[plata.frecventa])}
              {plata.anulat && <span className={styles.note}> (economisit prin anulare)</span>}
            </dd>
          </>
        )}

        <dt>ID</dt>
        <dd>{plata.id}</dd>
      </dl>

      {eroareActiune && (
        <p className="error" data-testid="action-error">
          Acțiunea nu a reușit: {eroareActiune}
        </p>
      )}

      <div className={styles.actions}>
        {esteAbonament && (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleCancel}
            disabled={seLucreaza}
            data-testid="detail-cancel"
          >
            {plata.anulat ? "Reactivează abonamentul" : "Anulează abonamentul"}
          </button>
        )}
        <button
          type="button"
          className={`btn-danger ${styles.deleteBtn}`}
          onClick={handleDelete}
          disabled={seLucreaza}
          data-testid="detail-delete"
        >
          Șterge
        </button>
      </div>
    </section>
  );
}
