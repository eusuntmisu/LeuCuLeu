import { useEffect, useState } from "react";
import SpiridusGame from "./SpiridusGame.jsx";
import BaniFaraNumar from "./BaniFaraNumar.jsx";
import ManaLunga from "./ManaLunga.jsx";
import Personaj from "./Personaj.jsx";
import { BANCNOTE, citesteJson, citesteNumar, formatRon } from "./bancnote.js";
import styles from "./MeniuJocuri.module.css";

const JOCURI = {
  spiridus: SpiridusGame,
  bani: BaniFaraNumar,
  mana: ManaLunga,
};

export default function MeniuJocuri({ onClose }) {
  const [jocActiv, setJocActiv] = useState(null);

  useEffect(() => {
    function laEscape(e) {
      if (e.key !== "Escape") return;
      if (jocActiv) setJocActiv(null);
      else onClose();
    }
    window.addEventListener("keydown", laEscape);
    return () => window.removeEventListener("keydown", laEscape);
  }, [jocActiv, onClose]);

  const Joc = jocActiv ? JOCURI[jocActiv] : null;

  if (Joc) {
    return (
      <div className={styles.overlay} role="dialog" aria-modal="true">
        <Joc onBack={() => setJocActiv(null)} />
      </div>
    );
  }

  const recordSpiridus = citesteNumar("leuculeu_highscore");
  const progresBani = citesteJson("leuculeu_fara_numar", { bani: 0, nivel: 0 });
  const recordMana = citesteNumar("leuculeu_mana_record");

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="titlu-meniu">
      <h2 id="titlu-meniu" className={styles.titlu}>Sala de jocuri LeuCuLeu</h2>
      <p className={styles.subtitlu}>Ai găsit colțul secret. Alege un joc:</p>

      <div className={styles.carduri}>
        <button className={styles.card} onClick={() => setJocActiv("spiridus")}>
          <div className={styles.preview}>
            <img src="/bani/50.jpg" alt="" className={styles.banCazator} />
            <div className={styles.personajMic}>
              <Personaj latime={44} />
            </div>
          </div>
          <h3 className={styles.cardTitlu}>Ploaie de RONI</h3>
          <p className={styles.cardText}>Prinde bancnotele care cad în coșul spiridușului.</p>
          <p className={styles.record}>Record: {formatRon(recordSpiridus)}</p>
        </button>

        <button className={styles.card} onClick={() => setJocActiv("bani")}>
          <div className={styles.preview}>
            {[0, 1, 2].map((i) => (
              <img
                key={i}
                src={BANCNOTE[Math.min(progresBani.nivel, 7)].imagine}
                alt=""
                className={styles.banEvantai}
                style={{ transform: `rotate(${(i - 1) * 14}deg) translateY(${i === 1 ? -6 : 0}px)` }}
              />
            ))}
          </div>
          <h3 className={styles.cardTitlu}>Bani fără număr</h3>
          <p className={styles.cardText}>Dă swipe ca să arunci bani și cumpără bancnote tot mai mari.</p>
          <p className={styles.record}>Portofel: {formatRon(progresBani.bani)}</p>
        </button>

        <button className={styles.card} onClick={() => setJocActiv("mana")}>
          <div className={styles.preview}>
            <div className={styles.lamaMica} />
            <img src="/bani/100.jpg" alt="" className={styles.banSubLama} />
          </div>
          <h3 className={styles.cardTitlu}>Mână Lungă</h3>
          <p className={styles.cardText}>Ia banii de sub lamă și retrage-ți mâna la timp. Nu te lăsa păcălit!</p>
          <p className={styles.record}>Record: {formatRon(recordMana)}</p>
        </button>
      </div>

      <button className={styles.inchide} onClick={onClose}>
        Înapoi la LeuCuLeu
      </button>
    </div>
  );
}
