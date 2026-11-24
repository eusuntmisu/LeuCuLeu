import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import MeniuJocuri from "./jocuri/MeniuJocuri.jsx";
import styles from "./Layout.module.css";

function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export default function Layout() {
  const [tema, setTema] = useState(temaInitiala);
  const [clickuriLogo, setClickuriLogo] = useState(0);

  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.themeToggle}
          onClick={handleTema}
          aria-label={tema === "dark" ? "Treci pe modul luminos" : "Treci pe modul întunecat"}
          title={tema === "dark" ? "Mod întunecat (click pentru luminos)" : "Mod luminos (click pentru întunecat)"}
          data-testid="theme-toggle"
        >
          {tema === "dark" ? (
            <svg key="luna" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
            </svg>
          ) : (
            <svg key="soare" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </g>
            </svg>
          )}
        </button>

        <img
          src="/leuculeu.png"
          alt="LeuCuLeu Logo"
          className={styles.logo}
          onClick={() => setClickuriLogo((prev) => prev + 1)}
        />

        <nav className={styles.nav} data-testid="nav">
          <NavLink to="/" end className={navClass}>
            Plăți
          </NavLink>
          <NavLink to="/pe-luna" className={navClass}>
            Pe lună
          </NavLink>
          <NavLink to="/despre" className={navClass}>
            Despre
          </NavLink>
        </nav>
      </header>

      {clickuriLogo >= 5 && <MeniuJocuri onClose={() => setClickuriLogo(0)} />}

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>LeuCuLeu · Proiect Tehnologii Web</footer>
    </>
  );
}
