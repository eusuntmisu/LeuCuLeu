
const plati = [
  { id: 1, nume: "Spotify Family", tip: "abonament", frecventa: "lunar", suma: 60, data: "2026-09-12", activ: true },
  { id: 2, nume: "Abonament Sală", tip: "abonament", frecventa: "lunar", suma: 180, data: "2026-09-05", activ: false },
  { id: 3, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false }
];

export default function App() {

  const active = plati.filter((p) => p.activ).length;


  return (
    <>
      <header className="app-header">
        <h1>LeuCuLeu</h1>
        <p>Gestionează-ți cheltuielile recurente și calculează-ți economiile.</p>
        <p className="app-count">
          {plati.length} tranzacții, dintre care {active} plăți active
        </p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Istoric tranzacții</h2>
          
          <pre>{JSON.stringify(plati, null, 2)}</pre>
        </section>
      </main>
    </>
  );
}