import { useEffect, useState } from "react";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // 📌 Aufgaben aus dem Backend laden
    useEffect(() => {
        fetch("http://localhost:5000/tasks")
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Fehler beim Abrufen:", err));
    }, []);

    // 📌 Neue Aufgabe hinzufügen
    const addTask = () => {
        fetch("http://localhost:5000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newTask })
        })
        .then(res => res.json())
        .then(task => setTasks([...tasks, task]))
        .catch(err => console.error("Fehler beim Hinzufügen:", err));

        setNewTask(""); // Eingabe leeren
    };

    // 📌 Aufgabe löschen
    const deleteTask = (id) => {
        fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" })
            .then(() => setTasks(tasks.filter(task => task._id !== id)))
            .catch(err => console.error("Fehler beim Löschen:", err));
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>TaskFlow</h1>
            <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="Neue Aufgabe..."
            />
            <button onClick={addTask}>Hinzufügen</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.name} - {task.status} 
                        <button onClick={() => deleteTask(task._id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
