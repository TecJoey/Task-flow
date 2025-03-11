import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS nur für das erlaubte Frontend aktivieren
app.use(cors({
  origin: ["https://taskflow-8law.onrender.com", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 📌 MongoDB-Verbindung mit Fehlerbehandlung
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB verbunden"))
.catch(err => {
  console.error("❌ MongoDB Fehler:", err);
  process.exit(1);  // Server beenden, wenn die DB-Verbindung fehlschlägt
});

// 📌 Beispielroute
app.get("/", (req, res) => {
  res.send("TaskFlow API läuft!");
});

// 📌 Alle Aufgaben abrufen
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Aufgaben" });
  }
});

// 📌 Neue Aufgabe erstellen
app.post("/tasks", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name der Aufgabe fehlt!" });
    }
    const newTask = new Task({ name });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Fehler beim Erstellen:", error);
    res.status(400).json({ message: "Fehler beim Erstellen der Aufgabe" });
  }
});

// 📌 Aufgabe aktualisieren
app.put("/tasks/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status fehlt!" });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Aufgabe nicht gefunden" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    res.status(400).json({ message: "Fehler beim Aktualisieren der Aufgabe" });
  }
});

// 📌 Aufgabe löschen
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Aufgabe nicht gefunden" });
    }
    res.json({ message: "Aufgabe gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    res.status(400).json({ message: "Fehler beim Löschen der Aufgabe" });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
