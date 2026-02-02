const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE_PATH = "./students.json";

// Read students from file
function readStudents() {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
}

// Write students to file
function writeStudents(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

// POST /students
app.post("/students", (req, res) => {
    const students = readStudents();
    students.push(req.body);
    writeStudents(students);
    res.status(201).json({ message: "Student added successfully" });
});

// GET /students
app.get("/students", (req, res) => {
    const students = readStudents();
    res.status(200).json(students);
});

// GET /students/:id
app.get("/students/:id", (req, res) => {
    const students = readStudents();
    const student = students.find(s => s.id == req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
});

// PUT /students/:id
app.put("/students/:id", (req, res) => {
    const students = readStudents();
    const index = students.findIndex(s => s.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    students[index] = { ...students[index], ...req.body };
    writeStudents(students);

    res.status(200).json({ message: "Student updated successfully" });
});

// DELETE /students/:id
app.delete("/students/:id", (req, res) => {
    const students = readStudents();
    const updatedStudents = students.filter(s => s.id != req.params.id);

    if (updatedStudents.length === students.length) {
        return res.status(404).json({ message: "Student not found" });
    }

    writeStudents(updatedStudents);
    res.status(200).json({ message: "Student deleted successfully" });
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on port 3000");
});
