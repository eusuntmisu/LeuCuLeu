import express from "express";
import cors from "cors";
import platiRouter from "./routes/plati.js";

const app = express();

// CORS: browserul blochează cererile de pe :5173 către :3001
// dacă serverul nu spune explicit că le permite
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

// Transformă corpul JSON al cererii în req.body
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/plati", platiRouter);

// Rută necunoscută
app.use((req, res) => {
  res.status(404).json({ error: "Ruta nu există" });
});

// Tratare centralizată a erorilor (Express 5 trimite aici și erorile async).
// Express o recunoaște după cei patru parametri, deci next rămâne chiar dacă nu e folosit.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  // JSON stricat în corpul cererii vine de la express.json() cu status 400
  const status = err.status || 500;
  const mesaj = err.type === "entity.parse.failed" ? "Corpul cererii nu este JSON valid" : err.message;
  res.status(status).json({ error: status === 500 ? "Eroare internă" : mesaj });
});

export default app;
