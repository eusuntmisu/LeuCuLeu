import { useEffect, useRef, useState } from "react";
import { BANCNOTE, alegeBancnota, citesteNumar, formatRon, salveaza } from "./bancnote.js";
import joc from "./Joc.module.css";
import styles from "./ManaLunga.module.css";

const CHEIE_RECORD = "leuculeu_mana_record";
const PONDERI = [40, 25, 15, 10, 6, 3, 1.5, 0.5];

const MANA_AFARA = 345;
const MANA_INAUNTRU = 132;
const MARGINE_LAMA = 196;
const SUS = 36;
const JOS = 230;
const POZITIE_SIGURA = (MANA_AFARA - MARGINE_LAMA - 6) / (MANA_AFARA - MANA_INAUNTRU);

function timpPrindere(bancnota) {
  return 320 + BANCNOTE.indexOf(bancnota) * 110;
}

function asteptare(scor) {
  const factor = Math.max(0.5, 1 - scor / 2500);
  return (650 + Math.random() * 1700) * factor;
}

function vedereInitiala() {
  return { mana: 0, lama: 0, prinsa: false, progres: 0, bancnota: BANCNOTE[0], scor: 0, tremura: false };
}

function ManaDesenata({ bancnota }) {
  return (
    <div className={styles.manaContinut}>
      {bancnota && <img src={bancnota.imagine} alt="" className={styles.banInMana} />}
      <svg viewBox="0 0 260 60" width="260" height="60" aria-hidden="true">
        <rect x="74" y="16" width="190" height="30" rx="6" fill="#1f2937" />
        <rect x="66" y="14" width="16" height="34" rx="4" fill="#10b981" stroke="#065f46" strokeWidth="1.5" />
        <path d="M30 18 Q44 10 66 16 L66 46 Q46 52 30 44 Z" fill="#f2c29b" stroke="#d39a6e" strokeWidth="1.5" />
        <rect x="6" y="17" width="34" height="7" rx="3.5" fill="#f2c29b" stroke="#d39a6e" strokeWidth="1.2" />
        <rect x="2" y="25" width="38" height="7" rx="3.5" fill="#f2c29b" stroke="#d39a6e" strokeWidth="1.2" />
        <rect x="4" y="33" width="36" height="7" rx="3.5" fill="#f2c29b" stroke="#d39a6e" strokeWidth="1.2" />
        <rect x="11" y="41" width="29" height="6" rx="3" fill="#f2c29b" stroke="#d39a6e" strokeWidth="1.2" />
        <path d="M44 14 Q34 4 22 8" stroke="#f2c29b" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M44 14 Q34 4 22 8" stroke="#d39a6e" strokeWidth="1.2" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function ManaLunga({ onBack }) {
  const [stare, setStare] = useState("start");
  const [vedere, setVedere] = useState(vedereInitiala);
  const [record, setRecord] = useState(() => citesteNumar(CHEIE_RECORD));
  const joaca = useRef(null);
  const cadru = useRef(null);

  useEffect(() => {
    return () => cancelAnimationFrame(cadru.current);
  }, []);

  useEffect(() => {
    function apasa(e) {
      if (e.code !== "Space" || !joaca.current) return;
      e.preventDefault();
      joaca.current.apasat = true;
    }
    function elibereaza(e) {
      if (e.code !== "Space" || !joaca.current) return;
      joaca.current.apasat = false;
    }
    window.addEventListener("keydown", apasa);
    window.addEventListener("keyup", elibereaza);
    return () => {
      window.removeEventListener("keydown", apasa);
      window.removeEventListener("keyup", elibereaza);
    };
  }, []);

  function terminaJocul(g) {
    cancelAnimationFrame(cadru.current);
    joaca.current = null;
    if (g.scor > citesteNumar(CHEIE_RECORD)) {
      salveaza(CHEIE_RECORD, String(g.scor));
      setRecord(g.scor);
    }
    setStare("pierdut");
  }

  function startJoc() {
    cancelAnimationFrame(cadru.current);
    const g = {
      ...vedereInitiala(),
      bancnota: alegeBancnota(PONDERI),
      apasat: false,
      stareLama: "sus",
      timpStare: 0,
      asteapta: asteptare(0),
      fenta: false,
      ultim: performance.now(),
    };
    joaca.current = g;
    setStare("joc");

    function pas(t) {
      const dt = Math.min(50, t - g.ultim);
      g.ultim = t;

      const limita = g.lama > 0.45 ? Math.max(g.mana, POZITIE_SIGURA) : 1;
      if (g.apasat) g.mana = Math.min(g.mana + dt / 220, limita);
      else g.mana = Math.max(0, g.mana - dt / 140);

      if (!g.prinsa) {
        if (g.mana >= 1) {
          g.progres += dt / timpPrindere(g.bancnota);
          if (g.progres >= 1) {
            g.progres = 1;
            g.prinsa = true;
          }
        } else {
          g.progres = Math.max(0, g.progres - dt / 400);
        }
      } else if (g.mana <= 0.05) {
        g.scor += g.bancnota.valoare;
        g.bancnota = alegeBancnota(PONDERI);
        g.prinsa = false;
        g.progres = 0;
      }

      g.timpStare += dt;
      if (g.stareLama === "sus") {
        if (g.timpStare >= g.asteapta) {
          g.fenta = Math.random() < 0.4;
          const cuTremur = g.fenta || Math.random() < 0.75;
          g.stareLama = cuTremur ? "tremura" : "cade";
          g.timpStare = 0;
        }
      } else if (g.stareLama === "tremura") {
        if (g.timpStare >= 260) {
          g.stareLama = g.fenta ? "fenta" : "cade";
          g.timpStare = 0;
        }
      } else if (g.stareLama === "fenta") {
        const ts = g.timpStare;
        g.lama = ts < 170 ? 0.32 * (ts / 170) : Math.max(0, 0.32 * (1 - (ts - 170) / 240));
        if (ts >= 410) {
          g.lama = 0;
          g.stareLama = "sus";
          g.timpStare = 0;
          g.asteapta = asteptare(g.scor);
        }
      } else if (g.stareLama === "cade") {
        g.lama = Math.min(1, g.lama + dt / 110);
        if (g.lama >= 1) {
          const xMana = MANA_AFARA - g.mana * (MANA_AFARA - MANA_INAUNTRU);
          if (xMana < MARGINE_LAMA) {
            setVedere({ ...g, tremura: false });
            terminaJocul(g);
            return;
          }
          g.stareLama = "jos";
          g.timpStare = 0;
        }
      } else if (g.stareLama === "jos") {
        if (g.timpStare >= 380) {
          g.stareLama = "urca";
          g.timpStare = 0;
        }
      } else if (g.stareLama === "urca") {
        g.lama = Math.max(0, g.lama - dt / 520);
        if (g.lama <= 0) {
          g.stareLama = "sus";
          g.timpStare = 0;
          g.asteapta = asteptare(g.scor);
        }
      }

      setVedere({
        mana: g.mana,
        lama: g.lama,
        prinsa: g.prinsa,
        progres: g.progres,
        bancnota: g.bancnota,
        scor: g.scor,
        tremura: g.stareLama === "tremura",
      });
      cadru.current = requestAnimationFrame(pas);
    }

    cadru.current = requestAnimationFrame(pas);
  }

  function apasaMana(e) {
    if (!joaca.current) return;
    joaca.current.apasat = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function retrageMana() {
    if (joaca.current) joaca.current.apasat = false;
  }

  const xMana = MANA_AFARA - vedere.mana * (MANA_AFARA - MANA_INAUNTRU);
  const yLama = SUS + vedere.lama * (JOS - SUS);
  const prins = stare === "pierdut";

  return (
    <div className={joc.ecran}>
      <div className={joc.bara}>
        <button className={joc.btnMeniu} onClick={onBack}>← Meniu</button>
      </div>

      <h2 className={joc.titlu}>Mână Lungă</h2>
      <p className={joc.scor}>
        Strâns: <strong>{formatRon(vedere.scor)}</strong> | Record: <strong>{formatRon(record)}</strong>
      </p>

      <div
        className={`${styles.scena} ${prins ? styles.lovit : ""}`}
        onPointerDown={apasaMana}
        onPointerUp={retrageMana}
        onPointerCancel={retrageMana}
        onLostPointerCapture={retrageMana}
      >
        <div className={`${styles.stalp} ${styles.stalpStanga}`} />
        <div className={`${styles.stalp} ${styles.stalpDreapta}`} />
        <div className={styles.grinda} />
        <div className={styles.franghie} style={{ height: yLama - SUS + 4 }} />
        <div className={`${styles.lama} ${vedere.tremura ? styles.tremura : ""}`} style={{ top: yLama }}>
          <div className={styles.greutate} />
          <div className={styles.tais} />
        </div>
        <div className={styles.bloc} />

        {!vedere.prinsa && (
          <img src={vedere.bancnota.imagine} alt={`${vedere.bancnota.valoare} lei`} className={styles.banPeBloc} />
        )}

        {vedere.progres > 0 && !vedere.prinsa && (
          <div className={styles.progres}>
            <div style={{ width: `${vedere.progres * 100}%` }} />
          </div>
        )}

        <div className={styles.mana} style={{ left: xMana }}>
          <ManaDesenata bancnota={vedere.prinsa ? vedere.bancnota : null} />
        </div>

        {stare !== "joc" && (
          <div className={joc.ecranFinal}>
            <h3 className={prins ? joc.pierdut : undefined}>{prins ? "Te-a prins lama!" : "Ia banii de sub lamă"}</h3>
            {prins ? (
              <p>Ai apucat să strângi {formatRon(vedere.scor)}.</p>
            ) : (
              <p>Ține apăsat ca să întinzi mâna, ia bancnota și retrage-te înainte să cadă lama. Atenție la fente!</p>
            )}
            <button className={joc.btnPrincipal} onClick={startJoc}>
              {prins ? "Mai încearcă" : "Începe jocul"}
            </button>
          </div>
        )}
      </div>

      <p className={joc.ajutor}>
        Ține apăsat pe scenă (sau tasta Space) ca să întinzi mâna. Bancnotele mari se apucă mai greu. Ridică degetul ca să
        retragi mâna cu banii.
      </p>
    </div>
  );
}
