import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ["offen", "in Bearbeitung", "erledigt"], default: "offen" }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
