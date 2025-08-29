const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Dummy data
let prompts = ["First dummy prompt", "Second dummy prompt"];
let users = {
  1: { id: 1, name: "Amanuel", role: "Backend Developer" },
  2: { id: 2, name: "Qasim", role: "Frontend Developer" }
};

// SQLite DB setup
const db = new sqlite3.Database(":memory:", (err) => {
  if (err) return console.error(err.message);
  console.log("Connected to SQLite in-memory DB.");

  db.run("CREATE TABLE prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)", (err) => {
    if (err) return console.error(err.message);
    console.log("Prompts table created.");
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// GET /prompts → returns dummy prompts
app.get("/prompts", (req, res) => {
  res.json({ prompts });
});

// POST /prompts → append new prompt
app.post("/prompts", (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Prompt text is required" });
  }

  prompts.push(text);
  db.run("INSERT INTO prompts (text) VALUES (?)", [text], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, text });
  });
});

// GET /users/:id → returns dummy user
app.get("/users/:id", (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
