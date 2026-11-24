import { useState, useEffect, useRef } from "react";
import Personaj from "./Personaj.jsx";
import { alegeBancnota, citesteNumar, salveaza } from "./bancnote.js";
import joc from "./Joc.module.css";
import styles from "./SpiridusGame.module.css";

const PONDERI = [50, 30, 15, 10, 8, 4, 2, 0.5];
const CHEIE_RECORD = "leuculeu_highscore";

export default function SpiridusGame({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => citesteNumar(CHEIE_RECORD));
  const [gameOver, setGameOver] = useState(true);
  const [aJucat, setAJucat] = useState(false);

  const [renderBani, setRenderBani] = useState([]);
  const [renderSpiridus, setRenderSpiridus] = useState(145);

  const spiridusX = useRef(145);
  const bani = useRef([]);
  const scorCurent = useRef(0);
  const timerRef = useRef(null);
  const recordRef = useRef(highScore);
  const frames = useRef(0);

  const startGame = () => {
    scorCurent.current = 0;
    setScore(0);
    bani.current = [];
    setRenderBani([]);
    setGameOver(false);
    setAJucat(true);
    frames.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      frames.current++;

      if (frames.current % 30 === 0) {
        const bancnotaAleasa = alegeBancnota(PONDERI);
        bani.current.push({
          id: Date.now() + Math.random(),
          x: Math.random() * 290,
          y: -40,
          imagine: bancnotaAleasa.imagine,
          valoare: bancnotaAleasa.valoare,
        });
      }

      let aRataUnBan = false;

      bani.current = bani.current.filter((b) => {
        b.y += 6;

        if (b.y > 310 && b.y < 370) {
          const diferentaX = Math.abs(b.x - spiridusX.current);
          if (diferentaX < 50) {
            scorCurent.current += b.valoare;
            setScore(scorCurent.current);
            return false;
          }
        }

        if (b.y > 450) {
          aRataUnBan = true;
          return false;
        }

        return true;
      });

      if (aRataUnBan) {
        clearInterval(timerRef.current);
        if (scorCurent.current > recordRef.current) {
          recordRef.current = scorCurent.current;
          salveaza(CHEIE_RECORD, String(scorCurent.current));
          setHighScore(scorCurent.current);
        }
        setGameOver(true);
      } else {
        setRenderBani([...bani.current]);
      }
    }, 30);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handlePointerMove = (e) => {
    if (gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left - 30;

    if (x < 0) x = 0;
    if (x > 290) x = 290;

    spiridusX.current = x;
    setRenderSpiridus(x);
  };

  return (
    <div className={joc.ecran}>
      <div className={joc.bara}>
        <button className={joc.btnMeniu} onClick={onBack}>← Meniu</button>
      </div>

      <h2 className={joc.titlu}>Ploaie de RONI!</h2>
      <p className={joc.scor}>
        Scor: <strong>{score} RON</strong> | Record: <strong>{highScore} RON</strong>
      </p>

      <div className={styles.board} onPointerMove={handlePointerMove} onPointerDown={handlePointerMove}>
        {renderBani.map((b) => (
          <img
            key={b.id}
            src={b.imagine}
            className={styles.ban}
            style={{ left: b.x, top: b.y }}
            alt=""
          />
        ))}

        <div className={styles.spiridus} style={{ left: renderSpiridus }}>
          <Personaj />
        </div>

        {gameOver && (
          <div className={joc.ecranFinal}>
            <h3 className={aJucat ? joc.pierdut : undefined}>
              {aJucat ? "Ai ratat un ban!" : "Prinde banii în coș"}
            </h3>
            {aJucat && <p>Ai strâns: {score} RON</p>}
            <button className={joc.btnPrincipal} onClick={startGame}>
              {aJucat ? "Joacă din nou" : "Începe jocul"}
            </button>
          </div>
        )}
      </div>

      <p className={joc.ajutor}>
        Mișcă mouse-ul (sau degetul) ca să prinzi bancnotele în coș. Dacă scapi una, jocul se termină.
      </p>
    </div>
  );
}
