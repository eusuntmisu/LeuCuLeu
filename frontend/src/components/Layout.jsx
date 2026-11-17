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
        <button className={styles.themeToggle} onClick={handleTema} aria-pressed={tema === "dark"}>
          {tema === "dark" ? "☀️ Mod luminos" : "🌙 Mod întunecat"}
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
