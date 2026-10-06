
const plati = [
  { id: 1, nume: "Spotify Family", tip: "abonament", frecventa: "lunar", suma: 60, data: "2026-09-12", activ: true },
  { id: 2, nume: "Abonament Sală", tip: "abonament", frecventa: "lunar", suma: 180, data: "2026-09-05", activ: false },
  { id: 3, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.50, data: "2026-09-28", activ: false }
];

const TIPURI_TRANZACTIE = ["abonament", "onetime"];

function listeazaNume(lista) {
  return lista.map((p) => p.nume);
}

function numaraActive(lista) {
  return lista.filter((p) => p.activ).length;
}

function cautaDupaNume(lista, text) {
  const textCautat = text.toLowerCase();
  return lista.filter((p) => p.nume.toLowerCase().includes(textCautat));
}

function gasestePlataDupaId(lista, id) {
  return lista.find((p) => p.id === id);
}

function nextId(lista) {
  return lista.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

function adaugaPlata(lista, nume, tip, frecventa, suma, data, activ = false) {
  const numeCurat = nume.trim();
  
  if (!numeCurat) {
    console.error("Numele tranzacției nu poate fi gol!");
    return lista;
  }
  
  if (!TIPURI_TRANZACTIE.includes(tip)) {
    console.error(`Tip invalid! Valorile permise sunt: ${TIPURI_TRANZACTIE.join(", ")}`);
    return lista;
  }

  if (typeof suma !== "number" || suma <= 0) {
    console.error("Suma trebuie să fie un număr strict mai mare ca 0!");
    return lista;
  }

  const plataNoua = {
    id: nextId(lista),
    nume: numeCurat,
    tip: tip,
    frecventa: frecventa,
    suma: suma,
    data: data,
    activ: activ
  };

  return [...lista, plataNoua];
}

function comutaStare(lista, id) {
  return lista.map((p) => (p.id === id ? { ...p, activ: !p.activ } : p));
}

function stergePlata(lista, id) {
  return lista.filter((p) => p.id !== id);
}


function filtreazaDupaTip(lista, tipCautat) {
  return lista.filter((p) => p.tip === tipCautat);
}

function calculeazaTotalPeLuna(lista, anLuna) {
  return lista
    .filter((p) => p.data.startsWith(anLuna)) // Ex: extrage doar cele din "2026-09"
    .reduce((total, p) => total + p.suma, 0);
}



console.log("--- Citire ---");
console.log("Nume plăți:", listeazaNume(plati).join(", "));
console.log("Plăți Neplătite / Abonamente Active:", numaraActive(plati));
console.log("Căutare 'super':", listeazaNume(cautaDupaNume(plati, "super")).join(", "));

console.log("--- Adăugare ---");
let listaNoua = adaugaPlata(plati, "Factură Curent", "onetime", "none", 150.50, "2026-10-06", false);
console.log("Lista nouă are:", listaNoua.length, "plăți");
console.log("Originalul a rămas cu:", plati.length, "plăți");

console.log("--- Modificare și ștergere ---");
listaNoua = comutaStare(listaNoua, 3); // Trecem cumpărăturile pe neplătite
console.log("După comutarea id 3, active:", numaraActive(listaNoua));
listaNoua = stergePlata(listaNoua, 2); // Ștergem abonamentul la sală
console.log("După ștergerea id 2, lista:", listeazaNume(listaNoua).join(", "));

console.log("--- Statistici și Filtre (Extra pt vizualizare luni) ---");
console.log("Toate abonamentele:", listeazaNume(filtreazaDupaTip(plati, "abonament")).join(", "));
console.log("Total cheltuit în Septembrie 2026:", calculeazaTotalPeLuna(plati, "2026-09"), "RON");

console.log("--- Validare ---");
adaugaPlata(listaNoua, "   ", "abonament", "lunar", 50, "2026-10-06"); // Eșuează (Nume gol)
adaugaPlata(listaNoua, "Test", "tip-gresit", "lunar", 50, "2026-10-06"); // Eșuează (Tip invalid)
adaugaPlata(listaNoua, "Eroare Sumă", "onetime", "none", -5, "2026-10-06"); // Eșuează (Suma negativă)