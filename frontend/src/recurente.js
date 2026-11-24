import { createPlata, deletePlata, fetchPlati, updatePlata } from "./api.js";
import { dataAzi } from "./lunaHelper.js";

const LUNI_INTRE_PLATI = { lunar: 1, trimestrial: 3, anual: 12 };
const MAX_GENERATE = 60; // plasa de siguranta pentru date foarte vechi

// Aceeasi zi, peste `luni` luni; daca luna e mai scurta, ultima zi a lunii.
function adaugaLuni(data, luni, ziua) {
  const [an, luna] = data.split("-").map(Number);
  const tinta = new Date(an, luna - 1 + luni, 1);
  const zileInLuna = new Date(tinta.getFullYear(), tinta.getMonth() + 1, 0).getDate();
  const zi = Math.min(ziua, zileInLuna);
  return `${tinta.getFullYear()}-${String(tinta.getMonth() + 1).padStart(2, "0")}-${String(zi).padStart(2, "0")}`;
}

// Abonamentele cu acelasi nume (fara diferente de litere mari/mici) si aceeasi frecventa
// sunt aceeasi serie. Ultima plata din serie e modelul pentru urmatoarea.
function cheieSerie(p) {
  return `${p.nume.trim().toLowerCase()}|${p.frecventa}`;
}

export function platiDeGenerat(plati, azi = dataAzi()) {
  const serii = new Map();
  for (const p of plati) {
    if (p.tip !== "abonament" || !LUNI_INTRE_PLATI[p.frecventa]) continue;
    const cheie = cheieSerie(p);
    const ultima = serii.get(cheie);
    if (!ultima || p.data > ultima.data) serii.set(cheie, p);
  }

  const noi = [];
  for (const ultima of serii.values()) {
    if (ultima.anulat) continue; // seria s-a oprit
    const pas = LUNI_INTRE_PLATI[ultima.frecventa];
    const ziua = Number(ultima.data.slice(8, 10));
    let data = ultima.data;
    let generate = 0;
    // Cat timp ultima plata e deja platita, adaugam urmatoarea (pana la prima din viitor).
    while (data <= azi && generate < MAX_GENERATE) {
      data = adaugaLuni(data, pas, ziua);
      noi.push({
        nume: ultima.nume,
        tip: "abonament",
        frecventa: ultima.frecventa,
        suma: ultima.suma,
        data,
        anulat: false,
      });
      generate += 1;
    }
  }
  return noi;
}

let sincronizareInCurs = null;

// Incarca platile si creeaza automat urmatoarele plati ale abonamentelor.
// Apelurile simultane (ex. StrictMode) folosesc aceeasi cerere, ca sa nu apara dubluri.
export function fetchPlatiSincronizate() {
  if (!sincronizareInCurs) {
    sincronizareInCurs = (async () => {
      const plati = await fetchPlati();
      const create = [];
      for (const p of platiDeGenerat(plati)) {
        create.push(await createPlata(p));
      }
      return [...plati, ...create];
    })().finally(() => {
      sincronizareInCurs = null;
    });
  }
  return sincronizareInCurs;
}

// Platile din aceeasi serie de abonament care vin dupa `plata`.
export function platiUlterioare(plata, plati) {
  if (plata.tip !== "abonament") return [];
  const cheie = cheieSerie(plata);
  return plati.filter((p) => p.tip === "abonament" && p.id !== plata.id && cheieSerie(p) === cheie && p.data > plata.data);
}

// Anularea opreste abonamentul din luna respectiva: plata devine "anulat" si toate
// platile de dupa ea sunt sterse. La reactivare, seria se completeaza din nou automat.
// Intoarce lista actualizata cu toate platile.
export async function comutaAnulare(plata) {
  if (!plata.anulat) {
    const toate = await fetchPlati();
    for (const p of platiUlterioare(plata, toate)) {
      await deletePlata(p.id);
    }
  }
  await updatePlata(plata.id, { anulat: !plata.anulat });
  return fetchPlatiSincronizate();
}

export function confirmaAnularea(plata, nrUlterioare) {
  if (nrUlterioare === 0) return true;
  return window.confirm(
    `Anulezi „${plata.nume}” din ${plata.data}. ` +
      `${nrUlterioare === 1 ? "Plata de după ea va fi ștearsă" : `Cele ${nrUlterioare} plăți de după ea vor fi șterse`}. Continui?`
  );
}
