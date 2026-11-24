export const BANCNOTE = [1, 5, 10, 20, 50, 100, 200, 500].map((valoare) => ({
  valoare,
  imagine: `/bani/${valoare}.jpg`,
}));

export function alegeBancnota(ponderi) {
  const total = ponderi.reduce((suma, p) => suma + p, 0);
  let r = Math.random() * total;
  for (let i = 0; i < ponderi.length; i++) {
    if (r < ponderi[i]) return BANCNOTE[i];
    r -= ponderi[i];
  }
  return BANCNOTE[0];
}

export function citesteNumar(cheie) {
  try {
    return Number(localStorage.getItem(cheie)) || 0;
  } catch {
    return 0;
  }
}

export function citesteJson(cheie, implicit) {
  try {
    const text = localStorage.getItem(cheie);
    return text ? { ...implicit, ...JSON.parse(text) } : implicit;
  } catch {
    return implicit;
  }
}

export function salveaza(cheie, valoare) {
  try {
    localStorage.setItem(cheie, typeof valoare === "string" ? valoare : JSON.stringify(valoare));
    return true;
  } catch {
    return false;
  }
}

export function formatRon(valoare) {
  return `${valoare.toLocaleString("ro-RO")} RON`;
}
