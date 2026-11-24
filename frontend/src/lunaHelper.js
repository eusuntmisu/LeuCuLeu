import { LUNI } from "./constants.js";

export function decaleazaLuna(anLuna, delta) {
  const [an, luna] = anLuna.split("-").map(Number);
  const d = new Date(an, luna - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function numeLuna(anLuna, scurt = false) {
  const [an, luna] = anLuna.split("-");
  const gasita = LUNI.find((l) => l.value === luna);
  const nume = gasita ? gasita.label : luna;
  return scurt ? `${nume.slice(0, 3)} ${an.slice(2)}` : `${nume} ${an}`;
}

export function formatRon(valoare) {
  return `${valoare.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} RON`;
}

// Acelasi calcul ca in pagina: abonamente neanulate + cheltuieli unice (platite sau nu).
// Doar abonamentele anulate nu se numara.
export function totaluriLuna(plati, luna) {
  let abonamente = 0;
  let unice = 0;
  for (const p of plati) {
    if (!p.data.startsWith(luna)) continue;
    if (p.tip === "abonament" && !p.anulat) abonamente += p.suma;
    else if (p.tip === "onetime") unice += p.suma;
  }
  return { luna, abonamente, unice, total: abonamente + unice };
}

export function dataAzi() {
  const azi = new Date();
  return `${azi.getFullYear()}-${String(azi.getMonth() + 1).padStart(2, "0")}-${String(azi.getDate()).padStart(2, "0")}`;
}

// Statusul vine din data: ce a trecut (sau e azi) e platit, ce e in viitor urmeaza.
// Doar anularea unui abonament se seteaza manual.
export const ETICHETE_STATUS = { anulat: "Anulat", platit: "Plătit", urmeaza: "Urmează" };

export function statusPlata(plata, azi = dataAzi()) {
  if (plata.tip === "abonament" && plata.anulat) return "anulat";
  return plata.data <= azi ? "platit" : "urmeaza";
}
