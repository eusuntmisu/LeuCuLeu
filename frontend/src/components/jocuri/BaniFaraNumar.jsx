import { useCallback, useEffect, useRef, useState } from "react";
import { BANCNOTE, citesteJson, formatRon, salveaza } from "./bancnote.js";
import joc from "./Joc.module.css";
import styles from "./BaniFaraNumar.module.css";

const CHEIE = "leuculeu_fara_numar";
const PRET_BANCNOTA = [0, 25, 120, 400, 1200, 4000, 12000, 40000];
const TEANC_MAXIM = 6;
const PROGRES_NOU = { bani: 0, nivel: 0, teanc: 1, aruncate: 0, aleasa: null };
const PRAG_SWIPE = 70;

function pretTeanc(teanc) {
  return 60 * 5 ** (teanc - 1);
}

export default function BaniFaraNumar({ onBack }) {
  const [progres, setProgres] = useState(() => citesteJson(CHEIE, PROGRES_NOU));
  const [zboara, setZboara] = useState([]);
  const [confirmaReset, setConfirmaReset] = useState(false);
  const start = useRef(null);
  const idUrmator = useRef(0);

  const { bani, nivel, teanc, aruncate } = progres;
  const aleasa = progres.aleasa === null ? nivel : Math.min(progres.aleasa, nivel);
  const bancnota = BANCNOTE[aleasa];
  const castig = bancnota.valoare * teanc;
  const urmatoarea = BANCNOTE[nivel + 1];
  const pretUrmatoare = PRET_BANCNOTA[nivel + 1];
  const pretTeancNou = pretTeanc(teanc);

  useEffect(() => {
    salveaza(CHEIE, progres);
  }, [progres]);

  const arunca = useCallback(() => {
    const valoare = BANCNOTE[aleasa].valoare * teanc;
    setProgres((p) => ({ ...p, bani: p.bani + valoare, aruncate: p.aruncate + p.teanc }));
    idUrmator.current += 1;
    const item = {
      id: idUrmator.current,
      imagine: BANCNOTE[aleasa].imagine,
      valoare,
      dx: `${Math.round(Math.random() * 160 - 80)}px`,
      rot: `${Math.round(Math.random() * 70 - 35)}deg`,
    };
    setZboara((z) => [...z.slice(-24), item]);
  }, [aleasa, teanc]);

  useEffect(() => {
    function laTasta(e) {
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        arunca();
      }
    }
    window.addEventListener("keydown", laTasta);
    return () => window.removeEventListener("keydown", laTasta);
  }, [arunca]);

  function laApasare(e) {
    start.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function laMiscare(e) {
    if (start.current === null) return;
    if (start.current - e.clientY > PRAG_SWIPE) {
      arunca();
      start.current = e.clientY;
    }
  }

  function laRidicare() {
    start.current = null;
  }

  function cumparaBancnota() {
    if (!urmatoarea || bani < pretUrmatoare) return;
    setProgres((p) => ({ ...p, bani: p.bani - pretUrmatoare, nivel: p.nivel + 1, aleasa: p.nivel + 1 }));
  }

  function alegeBancnota(index) {
    if (index > nivel) return;
    setProgres((p) => ({ ...p, aleasa: index }));
  }

  function cumparaTeanc() {
    if (teanc >= TEANC_MAXIM || bani < pretTeancNou) return;
    setProgres((p) => ({ ...p, bani: p.bani - pretTeancNou, teanc: p.teanc + 1 }));
  }

  function reseteaza() {
    if (!confirmaReset) {
      setConfirmaReset(true);
      return;
    }
    setProgres(PROGRES_NOU);
    setZboara([]);
    setConfirmaReset(false);
  }

  return (
    <div className={joc.ecran}>
      <div className={joc.bara}>
        <button className={joc.btnMeniu} onClick={onBack}>← Meniu</button>
      </div>

      <h2 className={joc.titlu}>Bani fără număr</h2>
      <p className={joc.scor}>
        Portofel: <strong>{formatRon(bani)}</strong>
      </p>

      <div
        className={styles.zona}
        onPointerDown={laApasare}
        onPointerMove={laMiscare}
        onPointerUp={laRidicare}
        onPointerCancel={laRidicare}
      >
        {zboara.map((z) => (
          <div
            key={z.id}
            className={styles.zbor}
            style={{ "--dx": z.dx, "--rot": z.rot }}
            onAnimationEnd={() => setZboara((lista) => lista.filter((x) => x.id !== z.id))}
          >
            <span className={styles.plus}>+{z.valoare}</span>
            <div className={styles.vertical}>
              <img src={z.imagine} alt="" />
            </div>
          </div>
        ))}

        <div className={styles.indiciu}>↑ Dă swipe în sus ↑</div>

        <div className={styles.teanc}>
          {[2, 1, 0].map((i) => (
            <div
              key={i}
              className={styles.vertical}
              style={{ transform: `translateY(${i * 5}px)`, opacity: i === 0 ? 1 : 0.7 }}
            >
              <img src={bancnota.imagine} alt={i === 0 ? `Bancnotă de ${bancnota.valoare} lei` : ""} />
            </div>
          ))}
        </div>

        <div className={styles.infoTeanc}>
          {bancnota.valoare} RON × {teanc} = <strong>+{castig} RON</strong> pe aruncare
        </div>
      </div>

      <div className={styles.colectie}>
        {BANCNOTE.map((b, i) => {
          let clasa = styles.blocata;
          if (i === aleasa) clasa = styles.aleasa;
          else if (i <= nivel) clasa = styles.detinuta;
          return (
            <button
              key={b.valoare}
              type="button"
              className={`${styles.miniBancnota} ${clasa}`}
              onClick={() => alegeBancnota(i)}
              disabled={i > nivel}
              aria-pressed={i === aleasa}
              title={i <= nivel ? `Aruncă bancnote de ${b.valoare} lei` : `Încă nu ai bancnota de ${b.valoare} lei`}
            >
              <span className={styles.vertical}>
                <img src={b.imagine} alt={`${b.valoare} lei`} />
              </span>
              <span className={styles.eticheta}>{b.valoare}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.magazin}>
        {urmatoarea ? (
          <button className={joc.btnPrincipal} onClick={cumparaBancnota} disabled={bani < pretUrmatoare}>
            Bancnota de {urmatoarea.valoare} RON · {formatRon(pretUrmatoare)}
          </button>
        ) : (
          <p className={styles.victorie}>Ai bancnota de 500! Acum chiar ai bani fără număr.</p>
        )}
        <button
          className={joc.btnPrincipal}
          onClick={cumparaTeanc}
          disabled={teanc >= TEANC_MAXIM || bani < pretTeancNou}
        >
          {teanc >= TEANC_MAXIM
            ? `Teanc maxim (×${TEANC_MAXIM})`
            : `Teanc mai gros ×${teanc + 1} · ${formatRon(pretTeancNou)}`}
        </button>
      </div>

      <p className={joc.ajutor}>
        Trage în sus pe teanc (sau apasă săgeata sus / Space) ca să arunci bani. Ai aruncat până acum{" "}
        {aruncate.toLocaleString("ro-RO")} bancnote.{" "}
        <button className={styles.reset} onClick={reseteaza}>
          {confirmaReset ? "Sigur? Apasă din nou" : "Ia-o de la capăt"}
        </button>
      </p>
    </div>
  );
}
