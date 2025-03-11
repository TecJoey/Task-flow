import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 📌 MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB verbunden"))
.catch(err => console.log("❌ MongoDB Fehler:", err));

// 📌 Beispielroute
app.get("/", (req, res) => {
    res.send("TaskFlow API läuft!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT}`);
});

import Task from "./models/Task.js";

// 📌 Alle Aufgaben abrufen
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen der Aufgaben" });
    }
});

// 📌 Neue Aufgabe erstellen
app.post("/tasks", async (req, res) => {
    try {
        const { name } = req.body;
        const newTask = new Task({ name });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: "Fehler beim Erstellen der Aufgabe" });
    }
});

// 📌 Aufgabe aktualisieren
app.put("/tasks/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: "Fehler beim Aktualisieren der Aufgabe" });
    }
});

// 📌 Aufgabe löschen
app.delete("/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Aufgabe gelöscht" });
    } catch (error) {
        res.status(400).json({ message: "Fehler beim Löschen der Aufgabe" });
    }
});

