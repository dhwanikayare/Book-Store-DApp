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

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const primaryButtonClass =
    "rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";

  const secondaryButtonClass =
    "rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-800 md:text-5xl">
            Book Store DApp
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500 md:text-lg">
            A decentralized bookstore powered by Ethereum smart contracts,
            MetaMask, and a local blockchain test network.
          </p>
        </div>

        {!contract && (
          <div className="mx-auto mb-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-semibold text-slate-800">
              Connect your wallet
            </h2>
            <p className="mb-6 text-slate-500">
              Connect MetaMask to interact with the bookstore, manage books, and
              send blockchain transactions.
            </p>
            <button
              onClick={connectToContract}
              className={primaryButtonClass}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        )}

        {contract && (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className={cardClass}>
                <p className="mb-2 text-sm font-medium text-slate-500">
                  Connected Account
                </p>
                <p className="break-all text-lg font-semibold text-slate-800">
                  {shortenAddress(account)}
                </p>
              </div>

              <div className={cardClass}>
                <p className="mb-2 text-sm font-medium text-slate-500">
                  Contract Owner
                </p>
                <p className="break-all text-lg font-semibold text-slate-800">
                  {shortenAddress(owner)}
                </p>
              </div>

              <div className={cardClass}>
                <p className="mb-2 text-sm font-medium text-slate-500">Role</p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    isOwner
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {isOwner ? "Owner / Admin" : "Customer"}
                </span>
              </div>

              <div className={cardClass}>
                <p className="mb-2 text-sm font-medium text-slate-500">Status</p>
                <p className="text-sm font-medium text-slate-800">
                  {statusMessage || "Ready"}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    📚 Available Books
                  </h2>
                  <p className="text-slate-500">
                    Browse the current on-chain bookstore catalogue.
                  </p>
                </div>

                <button
                  onClick={() => fetchAllBooks()}
                  className={secondaryButtonClass}
                >
                  Refresh Catalogue
                </button>
              </div>

              {isFetchingBooks ? (
                <div className={cardClass}>
                  <p className="text-slate-500">Loading books...</p>
                </div>
              ) : books.length === 0 ? (
                <div className={cardClass}>
                  <p className="text-slate-500">No books available yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {book.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            by {book.author}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          ID {book.id}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-blue-600">
                          {book.price} ETH
                        </span>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                          Stock: {book.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className={cardClass}>
                <h2 className="mb-1 text-xl font-bold text-slate-800">
                  🛒 Purchase Book
                </h2>
                <p className="mb-5 text-sm text-slate-500">
                  Buy available books by entering the book ID and quantity.
                </p>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="bookIdPurchase"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Book ID
                    </label>
                    <input
                      type="number"
                      id="bookIdPurchase"
                      value={bookIdPurchase}
                      className={inputClass}
                      onChange={(e) => setBookIdPurchase(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="quantity"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      className={inputClass}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={purchaseBook}
                    className={`w-full ${primaryButtonClass}`}
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? "Processing..." : "Purchase Book"}
                  </button>
                </div>
              </div>

              {isOwner && (
                <div className={cardClass}>
                  <h2 className="mb-1 text-xl font-bold text-slate-800">
                    ➕ Add Book
                  </h2>
                  <p className="mb-5 text-sm text-slate-500">
                    Owner only section for adding new books to the catalogue.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        Title
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        id="title"
                        value={bookDataAdd.title}
                        onChange={(e) =>
                          setBookDataAdd({
                            ...bookDataAdd,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="author"
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        Author
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        id="author"
                        value={bookDataAdd.author}
                        onChange={(e) =>
                          setBookDataAdd({
                            ...bookDataAdd,
                            author: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        Price in ETH
                      </label>
                      <input
                        className={inputClass}
                        type="number"
                        id="price"
                        value={bookDataAdd.price}
                        onChange={(e) =>
                          setBookDataAdd({
                            ...bookDataAdd,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="stock"
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        Stock
                      </label>
                      <input
                        className={inputClass}
                        type="number"
                        id="stock"
                        value={bookDataAdd.stock}
                        onChange={(e) =>
                          setBookDataAdd({
                            ...bookDataAdd,
                            stock: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <button
                        className={primaryButtonClass}
                        onClick={addBook}
                        disabled={isAdding}
                      >
                        {isAdding ? "Adding..." : "Add Book"}
                      </button>

                      <button
                        className={secondaryButtonClass}
                        onClick={withdrawFunds}
                        disabled={isWithdrawing}
                      >
                        {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className={cardClass}>
                <h2 className="mb-1 text-xl font-bold text-slate-800">
                  🔍 Get Book by ID
                </h2>
                <p className="mb-5 text-sm text-slate-500">
                  Retrieve details for a specific book directly from the smart
                  contract.
                </p>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="bookIdGet"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Book ID
                    </label>
                    <input
                      type="number"
                      id="bookIdGet"
                      value={bookIdGet}
                      onChange={(e) => setBookIdGet(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <button
                    onClick={getBook}
                    className={`w-full ${primaryButtonClass}`}
                  >
                    Get Book
                  </button>
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-slate-800">
                    Book Details
                  </h3>
                  {isBookLoading ? (
                    <p className="text-slate-500">Loading...</p>
                  ) : bookDataGet.title ? (
                    <div className="space-y-2 text-slate-700">
                      <p>
                        <strong>Title:</strong> {bookDataGet.title}
                      </p>
                      <p>
                        <strong>Author:</strong> {bookDataGet.author}
                      </p>
                      <p>
                        <strong>Price:</strong> {bookDataGet.price} ETH
                      </p>
                      <p>
                        <strong>Stock:</strong> {bookDataGet.stock}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-500">
                      No book selected. Enter a valid ID to view details.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}