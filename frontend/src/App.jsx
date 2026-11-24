import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import PlatiPage from "./pages/PlatiPage.jsx";
import PlataDetaliuPage from "./pages/PlataDetaliuPage.jsx";
import CheltuieliLunarePage from "./pages/CheltuieliLunarePage.jsx";
import DesprePage from "./pages/DesprePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PlatiPage />} />
        <Route path="/plati/:id" element={<PlataDetaliuPage />} />
        <Route path="/pe-luna" element={<CheltuieliLunarePage />} />
        <Route path="/despre" element={<DesprePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
