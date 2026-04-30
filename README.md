# 📚 Decentralized Book Store DApp

![Ethereum Smart Contract](https://img.shields.io/badge/Ethereum-Smart%20Contract-success)
![MetaMask](https://img.shields.io/badge/Wallet-MetaMask-blue)
![Hardhat](https://img.shields.io/badge/Framework-Hardhat-yellow)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-blueviolet)

---

## 📌 Overview

This project is a **Hybrid Decentralized Application (DApp)** that implements a blockchain-based bookstore system.

The application allows users to:
- Browse books stored on-chain
- Purchase books using ETH via MetaMask
- Add books (owner only)
- Retrieve book details
- Interact with a smart contract through a frontend and backend layer

This project demonstrates full-stack DApp development by integrating **frontend, backend, and blockchain components**.

---

## ⚠️ Acknowledgement

This project is based on and extended from the following open-source repository:

🔗 https://github.com/masterpranay1/Book-Store-DApp

Enhancements made include:
- Addition of a backend API layer
- Improved frontend UI/UX
- Better architectural separation (Hybrid DApp design)
- Enhanced smart contract functionality

---

## 🚀 Key Features

- 🔐 Wallet connection using MetaMask  
- 📚 View books directly from blockchain  
- 🛒 Purchase books using ETH  
- ➕ Add books (owner-only access)  
- 📖 Retrieve book details by ID  
- 💰 Withdraw contract funds (owner only)  
- 👥 Role-based access (Owner vs User)  
- 🔄 Real-time blockchain interaction  

---

## 🧱 Architecture

This project follows a **Hybrid DApp Architecture**:

- **Frontend (Next.js)**  
  Handles user interaction and UI rendering

- **Backend (Node.js + Express)**  
  Acts as an API layer to communicate with the smart contract

- **Blockchain (Solidity + Hardhat)**  
  Stores all book data and executes business logic

- **Wallet (MetaMask)**  
  Used for authentication and transaction signing

This layered approach improves scalability, maintainability, and separation of concerns compared to frontend-only DApps.

---

## 🛠️ Technologies Used

### 🎨 Frontend
- Next.js  
- TypeScript  
- Tailwind CSS  
- DaisyUI  
- Ethers.js  

### ⚙️ Backend
- Node.js  
- Express.js  

### ⛓️ Blockchain
- Solidity  
- Hardhat  
- Ethereum (Local Test Network)  

### 🔧 Tools
- MetaMask  
- Git & GitHub  

---

## 📜 Smart Contract Functionality

The smart contract includes:

- `addBook()` → Add a new book (owner only)  
- `purchaseBook()` → Purchase book using ETH  
- `getBook()` → Retrieve a specific book  
- `getAllBooks()` → Get all books in catalogue  
- `withdrawFunds()` → Withdraw contract balance (owner only)  

### Additional Improvements
- Input validation using `require`  
- Ownership control using `onlyOwner`  
- Event logging for transactions  
- Purchase tracking using mappings  

---

## 🔌 Backend API

A backend API was implemented using **Node.js and Express**.

### Available Endpoints:

- `GET /books` → Fetch all books  
- `GET /books/:id` → Retrieve book by ID  
- `POST /books` → Add a new book  

The backend communicates with the smart contract using **ethers.js**, providing a structured interface between frontend and blockchain.

---

## ⚙️ Getting Started

### 📋 Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)  
- MetaMask browser extension  
- Hardhat  
- Git  

---

## 📥 Installation

### Clone Repository

```bash
git clone https://github.com/dhwanikayare/Book-Store-DApp.git
cd Book-Store-DApp
