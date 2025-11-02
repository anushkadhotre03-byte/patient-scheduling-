import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to SQLite
const db = await open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

// Create table if not exists
await db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    doctor TEXT,
    reason TEXT
  )
`);

// Routes
app.get("/appointments", async (req, res) => {
  const rows = await db.all("SELECT * FROM appointments ORDER BY date, time");
  res.json(rows);
});

app.post("/appointments", async (req, res) => {
  const { id, name, phone, date, time, doctor, reason } = req.body;
  if (!id || !name || !date || !time) return res.status(400).send("Missing fields");
  await db.run(
    "INSERT OR REPLACE INTO appointments (id, name, phone, date, time, doctor, reason) VALUES (?,?,?,?,?,?,?)",
    [id, name, phone, date, time, doctor, reason]
  );
  res.sendStatus(200);
});

app.delete("/appointments/:id", async (req, res) => {
  await db.run("DELETE FROM appointments WHERE id = ?", [req.params.id]);
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(✅ Server running at http://localhost:${PORT}));