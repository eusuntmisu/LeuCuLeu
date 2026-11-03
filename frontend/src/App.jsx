import { useState, useEffect } from "react";
import PlataList from "./components/PlataList.jsx";
import PlataForm from "./components/PlataForm.jsx";
import SpiridusGame from "./components/SpiridusGame.jsx";
import { fetchPlati } from "./api.js";

function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [plati, setPlati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [arataFormular, setArataFormular] = useState(true);
  const [tema, setTema] = useState(temaInitiala);
  const [clickuriLogo, setClickuriLogo] = useState(0);


  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await fetchPlati();
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

  function handleToggle(id) {
    setPlati((prev) => prev.map((p) => (p.id === id ? { ...p, activ: !p.activ } : p)));
  }

  function handleDelete(id) {
    setPlati((prev) => prev.filter((p) => p.id !== id));
  }

  function handleAddPlata(nouaPlata) {
    setPlati((prev) => [nouaPlata, ...prev]);
  }

  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  const active = plati.filter((p) => p.activ).length;

  return (
    <>
      <header className="app-header" style={{ position: "relative" }}>
        <button className="theme-toggle" onClick={handleTema} aria-pressed={tema === "dark"}>
          {tema === "dark" ? "☀️ Mod luminos" : "🌙 Mod întunecat"}
        </button>

        <img 
          src="/leuculeu.png" 
          alt="LeuCuLeu Logo" 
          className="app-logo" 
          style={{ cursor: "pointer" }}
          onClick={() => setClickuriLogo((prev) => prev + 1)}
        />
        <p className="app-count">
          {plati.length} tranzacții, dintre care {active} plăți active
        </p>
      </header>

      {clickuriLogo >= 5 && <SpiridusGame onClose={() => setClickuriLogo(0)} />}

      <main className={`container ${!arataFormular ? "full-width" : ""}`}>
        {arataFormular && <PlataForm onAscunde={() => setArataFormular(false)} onAdd={handleAddPlata} />}

        <section className="panel">
          {!arataFormular && (
            <button className="icon-btn show-form-btn" onClick={() => setArataFormular(true)} title="Arată panoul de adăugare">➔</button>
          )}

          <div className="list-header">
            <h2>Istoric tranzacții</h2>
            <div className="filter-group">
              <select name="vizualizare_tip" defaultValue="all"><option value="all">Toate</option></select>
              <select name="filtru_luna" defaultValue="09"><option value="09">Septembrie</option></select>
              <select name="filtru_an" defaultValue="2026"><option value="2026">2026</option></select>
            </div>
          </div>
          

          {loading && <p className="info">Se încarcă istoricul de plăți...</p>}
          
          {error && (
            <div className="error">
              Nu am putut încărca datele: {error}.<br/>
              Serverul local rulează? Ai dat <code>npm run api</code> în al doilea terminal?
            </div>
          )}

          {!loading && !error && (
            <PlataList plati={plati} onToggle={handleToggle} onDelete={handleDelete} />
          )}
        </section>
      </main>
    </>
  );
}