import { Router } from "express";
import { parseId, valideazaPlata } from "../validation.js";

const router = Router();

// Etapa 9: datele stau în memorie și se pierd la repornire (Etapa 10 le mută în MariaDB).
// Exemplele din README: Spotify Family (activ), Abonament Sală (anulat), Licență GitHub Pro (anual).
let plati = [
  { id: 1, nume: "Spotify Family", tip: "abonament", frecventa: "lunar", suma: 60, data: "2026-09-12", finalizat: true, anulat: false },
  { id: 2, nume: "Spotify Family", tip: "abonament", frecventa: "lunar", suma: 60, data: "2026-10-12", finalizat: true, anulat: false },
  { id: 3, nume: "Spotify Family", tip: "abonament", frecventa: "lunar", suma: 60, data: "2026-11-12", finalizat: true, anulat: false },
  { id: 4, nume: "Abonament Sală", tip: "abonament", frecventa: "lunar", suma: 180, data: "2026-10-05", finalizat: true, anulat: false },
  { id: 5, nume: "Abonament Sală", tip: "abonament", frecventa: "lunar", suma: 180, data: "2026-11-05", finalizat: false, anulat: true },
  { id: 6, nume: "Licență GitHub Pro", tip: "abonament", frecventa: "anual", suma: 450, data: "2026-03-15", finalizat: true, anulat: false },
  { id: 7, nume: "Cumpărături Supermarket", tip: "onetime", frecventa: "none", suma: 250.5, data: "2026-09-28", finalizat: true, anulat: false },
  { id: 8, nume: "Asigurare Mașină", tip: "onetime", frecventa: "none", suma: 1200, data: "2026-10-15", finalizat: true, anulat: false },
  { id: 9, nume: "Netflix", tip: "abonament", frecventa: "lunar", suma: 50, data: "2026-11-10", finalizat: false, anulat: false },
];
let nextId = 10;

// Validează :id și găsește plata, sau răspunde cu 400 / 404
function gasesteIndex(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Id invalid" });
    return -1;
  }
  const index = plati.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Plata nu există" });
  }
  return index;
}

// GET /plati
router.get("/", (req, res) => {
  res.json(plati);
});

// GET /plati/:id
router.get("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  res.json(plati[index]);
});

// POST /plati
router.post("/", (req, res) => {
  const { erori, date } = valideazaPlata(req.body ?? {});
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }
  const plata = { id: nextId++, ...date };
  plati.push(plata);
  res.status(201).json(plata);
});

// PATCH /plati/:id (modificare parțială)
router.patch("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  const { erori, date } = valideazaPlata(req.body ?? {}, { partial: true, existenta: plati[index] });
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }
  plati[index] = { ...plati[index], ...date };
  res.json(plati[index]);
});

// DELETE /plati/:id
router.delete("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  plati.splice(index, 1);
  res.status(204).end();
});

export default router;
