import { useState } from "react";
import { formatRon, numeLuna, decaleazaLuna, totaluriLuna } from "../lunaHelper.js";
import styles from "./GraficLunar.module.css";

const LATIME = 720;
const INALTIME = 240;
const MARGINE = { sus: 12, dreapta: 8, jos: 28, stanga: 56 };
const NR_LUNI = 13; // 13 luni ca sa se vada si aceeasi luna de anul trecut

function pasRotund(maxim) {
  if (maxim <= 0) return 100;
  const brut = maxim / 4;
  const putere = 10 ** Math.floor(Math.log10(brut));
  const pas = [1, 2, 2.5, 5, 10].find((m) => m * putere >= brut) * putere;
  return pas;
}

// Bara cu colturile de sus rotunjite (capatul de date), ancorata in axa.
function caleBara(x, y, l, h, r) {
  if (h <= 0) return "";
  const raza = Math.min(r, h, l / 2);
  return `M${x},${y + h} V${y + raza} Q${x},${y} ${x + raza},${y} H${x + l - raza} Q${x + l},${y} ${x + l},${y + raza} V${y + h} Z`;
}

export default function GraficLunar({ plati, luna, lunaComparata, luniCuDate, onSelect }) {
  const [hover, setHover] = useState(null);

  const luni = Array.from({ length: NR_LUNI }, (_, i) => decaleazaLuna(luna, i - (NR_LUNI - 1)));
  const date = luni.map((l) => totaluriLuna(plati, l));

  const maxim = Math.max(...date.map((d) => d.total), 0);
  const pas = pasRotund(maxim);
  const topAxa = Math.max(pas, Math.ceil(maxim / pas) * pas);
  const tickuri = Array.from({ length: Math.round(topAxa / pas) + 1 }, (_, i) => i * pas);

  const latimePlot = LATIME - MARGINE.stanga - MARGINE.dreapta;
  const inaltimePlot = INALTIME - MARGINE.sus - MARGINE.jos;
  const slot = latimePlot / NR_LUNI;
  const latimeBara = Math.min(36, slot * 0.6);
  const yDin = (v) => MARGINE.sus + inaltimePlot - (v / topAxa) * inaltimePlot;
  const GAP = 2;

  const dHover = hover !== null ? date[hover] : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        <span><i className={`${styles.swatch} ${styles.swAbonamente}`} /> Abonamente active</span>
        <span><i className={`${styles.swatch} ${styles.swUnice}`} /> Cheltuieli unice</span>
        <span><i className={`${styles.swatch} ${styles.swComparat}`} /> Luna comparată</span>
      </div>

      <div className={styles.chartArea}>
        <svg
          viewBox={`0 0 ${LATIME} ${INALTIME}`}
          className={styles.svg}
          role="img"
          aria-label={`Cheltuieli pe ultimele ${NR_LUNI} luni, până în ${numeLuna(luna)}`}
          data-testid="monthly-chart"
        >
          {tickuri.map((t) => (
            <g key={t}>
              <line
                x1={MARGINE.stanga}
                x2={LATIME - MARGINE.dreapta}
                y1={yDin(t)}
                y2={yDin(t)}
                className={t === 0 ? styles.baseline : styles.grid}
              />
              <text x={MARGINE.stanga - 8} y={yDin(t)} className={styles.tickY}>
                {t.toLocaleString("ro-RO")}
              </text>
            </g>
          ))}

          {date.map((d, i) => {
            const cx = MARGINE.stanga + slot * i + slot / 2;
            const x = cx - latimeBara / 2;
            const yAb = yDin(d.abonamente);
            const hAb = MARGINE.sus + inaltimePlot - yAb;
            const yTot = yDin(d.total);
            const hUn = Math.max(0, yAb - yTot - (hAb > 0 ? GAP : 0));
            const eSelectata = d.luna === luna;
            const eComparata = d.luna === lunaComparata;
            const clickabila = luniCuDate.includes(d.luna) && !eSelectata;
            const atenuata = !eSelectata && !eComparata && hover !== i;

            return (
              <g
                key={d.luna}
                className={`${atenuata ? styles.dim : ""} ${clickabila ? styles.clickable : ""}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => clickabila && onSelect(d.luna)}
              >
                {/* zona de hover mai mare decat bara */}
                <rect x={cx - slot / 2} y={MARGINE.sus} width={slot} height={inaltimePlot} fill="transparent" />
                {hover === i && (
                  <rect x={cx - slot / 2 + 2} y={MARGINE.sus} width={slot - 4} height={inaltimePlot} className={styles.hoverBg} rx="4" />
                )}
                {hAb > 0 && (
                  <path
                    d={d.unice > 0 ? `M${x},${yAb} h${latimeBara} v${hAb} h${-latimeBara} Z` : caleBara(x, yAb, latimeBara, hAb, 4)}
                    className={styles.barAbonamente}
                  />
                )}
                {hUn > 0 && <path d={caleBara(x, yTot, latimeBara, hUn, 4)} className={styles.barUnice} />}
                {eComparata && d.total > 0 && (
                  <rect
                    x={x - 3}
                    y={yTot - 3}
                    width={latimeBara + 6}
                    height={MARGINE.sus + inaltimePlot - yTot + 3}
                    rx="6"
                    className={styles.comparatOutline}
                  />
                )}
                {(eSelectata || eComparata) && d.total > 0 && (
                  <text x={cx} y={yTot - 8} className={styles.valoare}>
                    {Math.round(d.total).toLocaleString("ro-RO")}
                  </text>
                )}
                <text
                  x={cx}
                  y={INALTIME - 8}
                  className={`${styles.tickX} ${eSelectata ? styles.tickSelectat : ""}`}
                >
                  {numeLuna(d.luna, true)}
                </text>
              </g>
            );
          })}
        </svg>

        {dHover && (
          <div
            className={styles.tooltip}
            style={{
              left: `${((MARGINE.stanga + slot * hover + slot / 2) / LATIME) * 100}%`,
              top: `${(yDin(dHover.total) / INALTIME) * 100}%`,
            }}
          >
            <strong>{numeLuna(dHover.luna)}</strong>
            <span><i className={`${styles.swatch} ${styles.swAbonamente}`} /> Abonamente: {formatRon(dHover.abonamente)}</span>
            <span><i className={`${styles.swatch} ${styles.swUnice}`} /> Unice: {formatRon(dHover.unice)}</span>
            <span className={styles.tooltipTotal}>Total: {formatRon(dHover.total)}</span>
          </div>
        )}
      </div>

      <details className={styles.tabel}>
        <summary>Vezi datele ca tabel</summary>
        <table>
          <thead>
            <tr>
              <th>Luna</th>
              <th>Abonamente</th>
              <th>Unice</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {date.map((d) => (
              <tr key={d.luna} className={d.luna === luna ? styles.randSelectat : ""}>
                <td>{numeLuna(d.luna)}</td>
                <td>{formatRon(d.abonamente)}</td>
                <td>{formatRon(d.unice)}</td>
                <td>{formatRon(d.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
