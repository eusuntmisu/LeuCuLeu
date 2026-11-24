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

// Platit se bifeaza manual pe card (campul finalizat); anularea e separata, doar la abonamente.
export const ETICHETE_STATUS = { anulat: "Anulat", platit: "Plătit", neplatit: "Neplătit" };

export function statusPlata(plata) {
  if (plata.tip === "abonament" && plata.anulat) return "anulat";
  return plata.finalizat ? "platit" : "neplatit";
}
