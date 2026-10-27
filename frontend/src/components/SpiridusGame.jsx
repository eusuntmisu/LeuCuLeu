import { useState, useEffect, useRef } from "react";
import "./SpiridusGame.css";

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
        bani.current.push({
          id: Date.now() + Math.random(),
          x: Math.random() * 290,
          y: -40,
          tip: Math.random() > 0.8 ? "💵" : "🪙", // 💵 = 50 RON, 🪙 = 10 RON
          valoare: Math.random() > 0.8 ? 50 : 10
        });
      }


      let aRataUnBan = false;
      
      bani.current = bani.current.filter((b) => {
        b.y += 6; // Viteza de cădere
        

        if (b.y > 360 && b.y < 420) {
          const diferentaX = Math.abs(b.x - spiridusX.current);
          if (diferentaX < 50) { // L-a prins!
            scorCurent.current += b.valoare;
            setScore(scorCurent.current);
            return false; // Îl ștergem din ecran
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
          <div key={b.id} className="ban-ron" style={{ left: b.x, top: b.y }}>
            {b.tip}
          </div>
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