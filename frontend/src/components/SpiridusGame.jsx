import { useState, useEffect, useRef } from "react";
import "./SpiridusGame.css";


const TIPURI_BANCNOTE = [
  { valoare: 1, imagine: "/bani/1.jpg", weight: 50 },
  { valoare: 5, imagine: "/bani/5.jpg", weight: 30 },
  { valoare: 10, imagine: "/bani/10.jpg", weight: 15 },
  { valoare: 50, imagine: "/bani/50.jpg", weight: 8 },
  { valoare: 100, imagine: "/bani/100.jpg", weight: 4 },
  { valoare: 200, imagine: "/bani/200.jpg", weight: 2 },
  { valoare: 500, imagine: "/bani/500.jpg", weight: 0.5 } 
];

function getRandomBancnota() {
  const totalWeight = TIPURI_BANCNOTE.reduce((sum, item) => sum + item.weight, 0);
  let randomNum = Math.random() * totalWeight;
  
  for (const bancnota of TIPURI_BANCNOTE) {
    if (randomNum < bancnota.weight) {
      return bancnota;
    }
    randomNum -= bancnota.weight;
  }
  return TIPURI_BANCNOTE[0];
}

export default function SpiridusGame({ onClose }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("leuculeu_highscore")) || 0);
  const [gameOver, setGameOver] = useState(true);
  
  const [renderBani, setRenderBani] = useState([]);
  const [renderSpiridus, setRenderSpiridus] = useState(145);

  const spiridusX = useRef(145);
  const bani = useRef([]);
  const scorCurent = useRef(0);
  const timerRef = useRef(null);
  const frames = useRef(0);

  const startGame = () => {
    scorCurent.current = 0;
    setScore(0);
    bani.current = [];
    setRenderBani([]);
    setGameOver(false);
    frames.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      frames.current++;
      

      if (frames.current % 30 === 0) {
        const bancnotaAleasa = getRandomBancnota();
        
        bani.current.push({
          id: Date.now() + Math.random(),
          x: Math.random() * 290, 
          y: -40,
          imagine: bancnotaAleasa.imagine,
          valoare: bancnotaAleasa.valoare
        });
      }

      let aRataUnBan = false;
      
      bani.current = bani.current.filter((b) => {
        b.y += 6; 
        
        if (b.y > 360 && b.y < 420) {
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
        setGameOver(true);
      } else {
        setRenderBani([...bani.current]);
      }
    }, 30);
  };

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem("leuculeu_highscore", score.toString());
    }
  }, [gameOver, score, highScore]);

  const handleMouseMove = (e) => {
    if (gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left - 30; 
    
    if (x < 0) x = 0;
    if (x > 290) x = 290;
    
    spiridusX.current = x;
    setRenderSpiridus(x);
  };

  return (
    <div className="easter-egg-overlay">
      <div className="game-header">
        <h2>Ploaie de RONI! 💰</h2>
        <p>Scor: <strong>{score} RON</strong> | Highscore: <strong>{highScore} RON</strong></p>
      </div>

      <div className="game-board" onMouseMove={handleMouseMove}>
        {renderBani.map((b) => (
          <img 
            key={b.id} 
            src={b.imagine} 
            className="ban-ron" 
            style={{ left: b.x, top: b.y }} 
            alt="Bancnotă"
          />
        ))}
        
        <div className="spiridus" style={{ left: renderSpiridus }}>
          🧝‍♂️🧺
        </div>

        {gameOver && (
          <div className="game-over-screen">
            <h2 style={{ color: score > 0 ? "white" : "#ef4444" }}>
              {score > 0 ? "Ai ratat un ban!" : "Jocul e gata!"}
            </h2>
            <p>Ai strâns: {score} RON</p>
            <button className="btn-joaca" onClick={startGame}>
              {score === 0 ? "Începe Jocul" : "Joacă din nou"}
            </button>
          </div>
        )}
      </div>

      <button className="btn-inchide" onClick={onClose}>Înapoi la LeuCuLeu</button>
    </div>
  );
}