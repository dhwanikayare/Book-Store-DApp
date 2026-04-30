import express from "express";
import cors from "cors";
import booksRouter from "./routes/books";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Book Store API is running" });
});

app.use("/api/books", booksRouter);

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});