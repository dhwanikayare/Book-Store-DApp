import { ethers } from "ethers";
import { getContract } from "../config/contract";

export type BookDto = {
  id: string;
  title: string;
  author: string;
  price: string;
  stock: string;
};

export async function getAllBooks(): Promise<BookDto[]> {
  const contract = await getContract();
  const books = await contract.getAllBooks();

  return books.map((book: any) => ({
    id: book.id.toString(),
    title: book.title,
    author: book.author,
    price: ethers.formatEther(book.price),
    stock: book.stock.toString(),
  }));
}

export async function getBookById(bookId: string): Promise<BookDto> {
  const contract = await getContract();
  const book = await contract.getBook(Number(bookId));

  return {
    id: book[0].toString(),
    title: book[1],
    author: book[2],
    price: ethers.formatEther(book[3]),
    stock: book[4].toString(),
  };
}

export async function addBook(
  title: string,
  author: string,
  priceEth: string,
  stock: number
): Promise<void> {
  const contract = await getContract();

  const tx = await contract.addBook(
    title,
    author,
    ethers.parseEther(priceEth),
    stock
  );

  await tx.wait();
}