"use client";
import { useState, useEffect } from "react";
import atm_abi from "../artifacts/contracts/BookStore.sol/BookStore.json";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type BookCard = {
  id: string;
  title: string;
  author: string;
  price: string;
  stock: string;
};

const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function Home() {
  const contractABI = atm_abi.abi;
  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [bookIdPurchase, setBookIdPurchase] = useState("");
  const [quantity, setQuantity] = useState("");

  const [bookDataAdd, setBookDataAdd] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  });

  const [bookDataGet, setBookDataGet] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  });

  const [bookIdGet, setBookIdGet] = useState("");
  const [books, setBooks] = useState<BookCard[]>([]);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [isFetchingBooks, setIsFetchingBooks] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const isOwner =
    account && owner && account.toLowerCase() === owner.toLowerCase();

 const connectToContract = async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask is not installed or not available in this browser.");
      return;
    }

    setIsConnecting(true);
    setStatusMessage("Connecting wallet...");

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    console.log("Connected account:", userAddress);
    console.log("Frontend contract address:", contractAddress);
    console.log("Connected network:", network);

    const code = await provider.getCode(contractAddress);
    console.log("Contract code at address:", code);

    if (code === "0x") {
      throw new Error(
        "No contract code found at this address. Redeploy contract and update .env.local."
      );
    }

    const connectedContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    const ownerAddress = await connectedContract.owner();
    console.log("Contract owner:", ownerAddress);

    setAccount(userAddress);
    setOwner(ownerAddress);
    setContract(connectedContract);
    setStatusMessage("Wallet connected successfully.");
  } catch (error) {
    console.error("Error connecting to the contract:", error);
    setStatusMessage("Failed to connect wallet.");
    alert("Failed to connect wallet. Check browser console.");
  } finally {
    setIsConnecting(false);
  }
};

  const fetchAllBooks = async (activeContract?: ethers.Contract | null) => {
    const contractToUse = activeContract || contract;
    if (!contractToUse) return;

    try {
      setIsFetchingBooks(true);
      const result = await contractToUse.getAllBooks();

      const formattedBooks: BookCard[] = result.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        price: ethers.utils.formatEther(book.price),
        stock: book.stock.toString(),
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsFetchingBooks(false);
    }
  };

  const addBook = async () => {
    if (!contract) {
      alert("Connect wallet first.");
      return;
    }

    if (
      !bookDataAdd.title.trim() ||
      !bookDataAdd.author.trim() ||
      !bookDataAdd.price.trim() ||
      !bookDataAdd.stock.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsAdding(true);
      setStatusMessage("Adding book...");

      const tx = await contract.addBook(
        bookDataAdd.title,
        bookDataAdd.author,
        ethers.utils.parseEther(bookDataAdd.price),
        Number(bookDataAdd.stock)
      );

      await tx.wait();

      setBookDataAdd({
        title: "",
        author: "",
        price: "",
        stock: "",
      });

      setStatusMessage("Book added successfully.");
      alert("Book added successfully!");
      await fetchAllBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      setStatusMessage("Failed to add book.");
      alert("Error adding book. Check the console for details.");
    } finally {
      setIsAdding(false);
    }
  };

  const purchaseBook = async () => {
    if (!contract) {
      alert("Connect wallet first.");
      return;
    }

    if (!bookIdPurchase || !quantity) {
      alert("Please enter both Book ID and quantity.");
      return;
    }

    try {
      setIsPurchasing(true);
      setStatusMessage("Preparing purchase...");

      const book = await contract.getBook(Number(bookIdPurchase));
      const priceWei = book[3];
      const totalCost = priceWei.mul(Number(quantity));

      const transaction = await contract.purchaseBook(
        Number(bookIdPurchase),
        Number(quantity),
        {
          value: totalCost,
        }
      );

      await transaction.wait();

      setBookIdPurchase("");
      setQuantity("");
      setStatusMessage("Book purchased successfully.");
      alert("Book purchased successfully!");

      await fetchAllBooks();
    } catch (error) {
      console.error("Error purchasing book:", error);
      setStatusMessage("Purchase failed.");
      alert("Error purchasing book. Check the console for details.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const getBook = async () => {
    if (!contract) {
      alert("Connect wallet first.");
      return;
    }

    if (!bookIdGet) {
      alert("Please enter a Book ID.");
      return;
    }

    try {
      setIsBookLoading(true);

      const book = await contract.getBook(Number(bookIdGet));

      setBookDataGet({
        title: book[1],
        author: book[2],
        price: ethers.utils.formatEther(book[3]),
        stock: book[4].toString(),
      });

      setStatusMessage("Book retrieved successfully.");
    } catch (error) {
      console.error("Error getting book:", error);
      setStatusMessage("Failed to retrieve book.");
      alert("Error getting book. Check the console for details.");
    } finally {
      setIsBookLoading(false);
    }
  };

  const withdrawFunds = async () => {
    if (!contract) {
      alert("Connect wallet first.");
      return;
    }

    try {
      setIsWithdrawing(true);
      setStatusMessage("Withdrawing funds...");

      const tx = await contract.withdrawFunds();
      await tx.wait();

      setStatusMessage("Funds withdrawn successfully.");
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      setStatusMessage("Withdraw failed.");
      alert("Error withdrawing funds. Check the console for details.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchAllBooks();
    }
  }, [contract]);

  return (
    <main className="min-h-screen px-6 md:px-16 py-12 flex flex-col">
      <h1 className="text-5xl font-bold w-full text-center pb-8 mb-8 text-blue-500 border-b">
        Book Store DApp
      </h1>

      {!contract && (
        <button
          onClick={connectToContract}
          className="border rounded-lg px-6 py-3 mx-auto font-semibold"
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      {contract && (
        <>
          <div className="border rounded-lg p-4 mb-8">
            <p>
              <strong>Connected Account:</strong> {account}
            </p>
            <p>
              <strong>Contract Owner:</strong> {owner}
            </p>
            <p>
              <strong>Role:</strong> {isOwner ? "Owner/Admin" : "Customer"}
            </p>
            <p>
              <strong>Status:</strong> {statusMessage || "Ready"}
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Available Books</h2>
              <button
                onClick={() => fetchAllBooks()}
                className="border rounded-lg px-4 py-2"
              >
                Refresh Catalogue
              </button>
            </div>

            {isFetchingBooks ? (
              <p>Loading books...</p>
            ) : books.length === 0 ? (
              <p>No books available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {books.map((book) => (
                  <div key={book.id} className="border p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p>
                      <strong>ID:</strong> {book.id}
                    </p>
                    <p>
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p>
                      <strong>Price:</strong> {book.price} ETH
                    </p>
                    <p>
                      <strong>Stock:</strong> {book.stock}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="flex flex-col border p-4 gap-4 rounded-lg">
              <h2 className="text-xl font-bold">Purchase Book</h2>

              <label htmlFor="bookIdPurchase">Book ID:</label>
              <input
                type="number"
                id="bookIdPurchase"
                value={bookIdPurchase}
                className="border rounded p-2"
                onChange={(e) => setBookIdPurchase(e.target.value)}
              />

              <label htmlFor="quantity">Quantity:</label>
              <input
                className="border rounded p-2"
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <button
                onClick={purchaseBook}
                className="border rounded-lg px-4 py-2 font-semibold"
                disabled={isPurchasing}
              >
                {isPurchasing ? "Processing..." : "Purchase"}
              </button>
            </div>

            {isOwner && (
              <div className="flex flex-col border p-4 gap-4 rounded-lg">
                <h2 className="text-xl font-bold">Add Book</h2>

                <label htmlFor="title">Title:</label>
                <input
                  className="border rounded p-2"
                  type="text"
                  id="title"
                  value={bookDataAdd.title}
                  onChange={(e) =>
                    setBookDataAdd({ ...bookDataAdd, title: e.target.value })
                  }
                />

                <label htmlFor="author">Author:</label>
                <input
                  className="border rounded p-2"
                  type="text"
                  id="author"
                  value={bookDataAdd.author}
                  onChange={(e) =>
                    setBookDataAdd({ ...bookDataAdd, author: e.target.value })
                  }
                />

                <label htmlFor="price">Price in ETH:</label>
                <input
                  className="border rounded p-2"
                  type="number"
                  id="price"
                  value={bookDataAdd.price}
                  onChange={(e) =>
                    setBookDataAdd({ ...bookDataAdd, price: e.target.value })
                  }
                />

                <label htmlFor="stock">Stock:</label>
                <input
                  className="border rounded p-2"
                  type="number"
                  id="stock"
                  value={bookDataAdd.stock}
                  onChange={(e) =>
                    setBookDataAdd({ ...bookDataAdd, stock: e.target.value })
                  }
                />

                <button
                  className="border rounded-lg px-4 py-2 font-semibold"
                  onClick={addBook}
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add Book"}
                </button>

                <button
                  className="border rounded-lg px-4 py-2 font-semibold"
                  onClick={withdrawFunds}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
                </button>
              </div>
            )}

            <div className="p-4 border rounded-lg">
              <div className="w-full flex flex-col gap-4">
                <h2 className="text-xl font-bold">Get Book by ID</h2>

                <label htmlFor="bookIdGet">Book ID:</label>
                <input
                  type="number"
                  id="bookIdGet"
                  value={bookIdGet}
                  onChange={(e) => setBookIdGet(e.target.value)}
                  className="border rounded p-2"
                />

                <button
                  onClick={getBook}
                  className="border rounded-lg px-4 py-2 font-semibold"
                >
                  Get Book
                </button>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <h2 className="text-xl">Book Details</h2>
                {isBookLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <p>Title: {bookDataGet.title}</p>
                    <p>Author: {bookDataGet.author}</p>
                    <p>Price: {bookDataGet.price} ETH</p>
                    <p>Stock: {bookDataGet.stock}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
