// Validare pe server: datele de la client nu sunt niciodată de încredere.
// Valorile fixe trebuie să fie identice cu cele din frontend/src/constants.js.
export const TIPURI = ["abonament", "onetime"];
export const FRECVENTE = ["lunar", "trimestrial", "anual", "none"];
const NUME_MAX = 100;
const SUMA_MAX = 1_000_000;

function dataAzi() {
  const azi = new Date();
  return `${azi.getFullYear()}-${String(azi.getMonth() + 1).padStart(2, "0")}-${String(azi.getDate()).padStart(2, "0")}`;
}

// "YYYY-MM-DD" și ziua să existe în lună (fără 2026-02-30)
function esteDataValida(text) {
  if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const [an, luna, zi] = text.split("-").map(Number);
  const d = new Date(an, luna - 1, zi);
  return d.getFullYear() === an && d.getMonth() === luna - 1 && d.getDate() === zi;
}

function valideazaBoolean(body, camp, erori, date, partial) {
  if (body[camp] !== undefined) {
    if (typeof body[camp] !== "boolean") {
      erori.push(`${camp} trebuie să fie true sau false`);
    } else {
      date[camp] = body[camp];
    }
  } else if (!partial) {
    date[camp] = false;
  }
}

// partial = true pentru PATCH (se verifică doar câmpurile trimise).
// existenta = plata din memorie, pentru PATCH: regulile dintre câmpuri (tip ↔ frecvență)
// se verifică pe rezultatul final, nu doar pe ce s-a trimis.
export function valideazaPlata(body, { partial = false, existenta = {} } = {}) {
  const erori = [];
  const date = {};

  if (!partial || body.nume !== undefined) {
    if (typeof body.nume !== "string" || body.nume.trim() === "") {
      erori.push("nume este obligatoriu");
    } else if (body.nume.trim().length > NUME_MAX) {
      erori.push(`nume are maximum ${NUME_MAX} de caractere`);
    } else {
      date.nume = body.nume.trim();
    }
  }

  if (!partial || body.tip !== undefined) {
    const tip = body.tip ?? "abonament";
    if (!TIPURI.includes(tip)) {
      erori.push(`tip trebuie să fie una din: ${TIPURI.join(", ")}`);
    } else {
      date.tip = tip;
    }
  }

  if (!partial || body.frecventa !== undefined) {
    const tip = date.tip ?? existenta.tip;
    const frecventa = body.frecventa ?? (tip === "onetime" ? "none" : "lunar");
    if (!FRECVENTE.includes(frecventa)) {
      erori.push(`frecventa trebuie să fie una din: ${FRECVENTE.join(", ")}`);
    } else {
      date.frecventa = frecventa;
    }
  }

  if (!partial || body.suma !== undefined) {
    if (typeof body.suma !== "number" || !Number.isFinite(body.suma) || body.suma <= 0) {
      erori.push("suma trebuie să fie un număr mai mare decât 0");
    } else if (body.suma > SUMA_MAX) {
      erori.push(`suma este de maximum ${SUMA_MAX.toLocaleString("ro-RO")}`);
    } else {
      date.suma = Math.round(body.suma * 100) / 100;
    }
  }

  if (body.data !== undefined) {
    if (!esteDataValida(body.data)) {
      erori.push("data trebuie să fie o dată validă, de forma AAAA-LL-ZZ");
    } else {
      date.data = body.data;
    }
  } else if (!partial) {
    date.data = dataAzi();
  }

  valideazaBoolean(body, "finalizat", erori, date, partial);
  valideazaBoolean(body, "anulat", erori, date, partial);

  // Reguli între câmpuri, pe plata așa cum va arăta după salvare
  if (erori.length === 0) {
    const rezultat = { ...existenta, ...date };
    if (rezultat.tip === "onetime" && rezultat.frecventa !== "none") {
      erori.push("o cheltuială unică are frecventa none");
    } else if (rezultat.tip === "abonament" && rezultat.frecventa === "none") {
      erori.push("un abonament are frecventa lunar, trimestrial sau anual");
    }
    if (rezultat.tip === "onetime" && rezultat.anulat) {
      erori.push("doar abonamentele pot fi anulate");
    }
  }

  return { erori, date };
}

// Id-urile din adresă vin ca text; se acceptă doar numere întregi pozitive
export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
