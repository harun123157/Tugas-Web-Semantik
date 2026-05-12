const express = require("express");
const cors = require("cors");
const taskController = require("./controllers/taskController");

const app = express();

// Jawaban Soal No 4 (Mengizinkan CORS dari Vue)
app.use(cors({
  origin: "http://localhost:5173" 
}));
// 

app.use(express.json());

// Routes Endpoint
app.get("/api/tasks", taskController.list);
app.get("/api/tasks/:id", taskController.detail);
app.post("/api/tasks", taskController.create);
app.put("/api/tasks/:id", taskController.update);
app.delete("/api/tasks/:id", taskController.remove);

// Middleware untuk menangani Error
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// Menjalankan Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server Express berhasil berjalan di http://localhost:${PORT}`);
});