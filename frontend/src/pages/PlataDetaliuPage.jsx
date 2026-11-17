import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPlata } from "../api.js";
import { ETICHETE_FRECVENTA, ETICHETE_TIP, PLATI_PE_AN } from "../constants.js";
import styles from "./PlataDetaliuPage.module.css";

function formatRon(valoare) {
  return `${valoare.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} RON`;
}

export default function PlataDetaliuPage() {
  const { id } = useParams();
  const [plata, setPlata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  let status = "Activ";
  if (plata.finalizat) status = esteAbonament ? "Anulat" : "Plătit";

  return (
    <section className={`panel ${styles.detail}`} data-testid="detail">
      <Link to="/" className={styles.back}>
        ← Înapoi la listă
      </Link>

      <h2 className={plata.finalizat ? styles.done : undefined} data-testid="detail-title">
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
              {plata.finalizat && <span className={styles.note}> (economisit prin anulare)</span>}
            </dd>
          </>
        )}

        <dt>ID</dt>
        <dd>{plata.id}</dd>
      </dl>
    </section>
  );
}
