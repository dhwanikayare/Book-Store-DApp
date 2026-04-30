import { Router, Request, Response } from "express";
import { addBook, getAllBooks, getBookById } from "../services/bookService";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
  const book = await getBookById(req.params.id as string);
    res.json(book);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, author, price, stock } = req.body;

    if (!title || !author || !price || stock === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await addBook(title, author, String(price), Number(stock));
    res.status(201).json({ message: "Book added successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;