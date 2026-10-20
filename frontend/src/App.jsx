import { useState } from "react";
import PlataList from "./components/PlataList.jsx";
import PlataForm from "./components/PlataForm.jsx";

const plati = [
  { id: 1, nume: "Spotify Family", tip: "abonament", frecventa: "lunar", suma: 60, data: "2026-09-12", activ: true },
  { id: 2, nume: "Abonament Sală", tip: "abonament", frecventa: "lunar", suma: 180, data: "2026-09-05", activ: false },
  { id: 3, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false },
  { id: 6, nume: "laptop", tip: "onetime", frecventa: "none", suma: 4000, data: "2026-10-18", activ: true },
  { id: 7, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false },
  { id: 8, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false },
  { id: 9, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false },
  { id: 11, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false },
  { id: 12, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false },
  { id: 13, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false }

];

export default function App() {
  const active = plati.filter((p) => p.activ).length;
  const [arataFormular, setArataFormular] = useState(true);

  return (
    <>
      <header className="app-header">
        <h1>LeuCuLeu</h1>
        <p>Gestionează-ți cheltuielile recurente și calculează-ți economiile.</p>
        <p className="app-count">
          {plati.length} tranzacții, dintre care {active} plăți active
        </p>
      </header>

      <main className={`container ${!arataFormular ? "full-width" : ""}`}>
        
        {arataFormular && <PlataForm onAscunde={() => setArataFormular(false)} />}

        <section className="panel">
          
          {!arataFormular && (
            <button 
              className="icon-btn show-form-btn" 
              onClick={() => setArataFormular(true)}
              title="Arată panoul de adăugare"
            >
              ➔
            </button>
          )}

          <div className="list-header">
            <h2>Istoric tranzacții</h2>
            <div className="filter-group">
              <select name="vizualizare_tip" defaultValue="all">
                <option value="all">Toate (Ultimele 50)</option>
                <option value="abonamente">Doar Abonamente</option>
                <option value="onetime">Doar Cheltuieli Unice</option>
              </select>
              
              <select name="filtru_luna" defaultValue="09">
                <option value="all">Toate lunile</option>
                <option value="01">Ianuarie</option>
                <option value="02">Februarie</option>
                <option value="03">Martie</option>
                <option value="04">Aprilie</option>
                <option value="05">Mai</option>
                <option value="06">Iunie</option>
                <option value="07">Iulie</option>
                <option value="08">August</option>
                <option value="09">Septembrie</option>
                <option value="10">Octombrie</option>
                <option value="11">Noiembrie</option>
                <option value="12">Decembrie</option>
              </select>

              <select name="filtru_an" defaultValue="2026">
                <option value="all">Toți anii</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>
          
          <PlataList plati={plati} />
        </section>

      </main>
    </>
  );
}