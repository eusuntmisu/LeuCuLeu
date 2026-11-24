export const TIPURI = [
  { value: "abonament", label: "Abonament (Recurent)" },
  { value: "onetime", label: "Cheltuială unică (One-time)" },
];

export const FRECVENTE = [
  { value: "lunar", label: "Lunar" },
  { value: "trimestrial", label: "Trimestrial" },
  { value: "anual", label: "Anual" },
  { value: "none", label: "- Nu se aplică -" },
];

export const ETICHETE_FRECVENTA = {
  lunar: "Abonament Lunar",
  trimestrial: "Trimestrial",
  anual: "Anual",
  none: "One-time",
};

export const ETICHETE_TIP = Object.fromEntries(TIPURI.map((t) => [t.value, t.label]));

export const PLATI_PE_AN = { lunar: 12, trimestrial: 4, anual: 1, none: 1 };

export const LUNI = [
  { value: "01", label: "Ianuarie" },
  { value: "02", label: "Februarie" },
  { value: "03", label: "Martie" },
  { value: "04", label: "Aprilie" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Iunie" },
  { value: "07", label: "Iulie" },
  { value: "08", label: "August" },
  { value: "09", label: "Septembrie" },
  { value: "10", label: "Octombrie" },
  { value: "11", label: "Noiembrie" },
  { value: "12", label: "Decembrie" },
];
