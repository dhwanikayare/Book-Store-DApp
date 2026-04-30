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

## ⚙️ Installation & Setup

### 📦 Install Dependencies

```bash
npm install


### ⛓️ Smart Contract Setup
## Compile Contract

```bash
npx hardhat compile

##Start Local Blockchain
```bash
npx hardhat node

## Deploy Contract
```bash
npx hardhat run scripts/deploy.ts --network localhost

## After deployment, copy the contract address.

### 🔐 Environment Configuration

## Create a .env.local file in the root directory:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS

### ▶️ Run Application
```bash
npm run dev

## Open in browser:
```bash
http://localhost:3000

### 🦊 MetaMask Configuration

## Add the Hardhat Local Network:
```bash
Network Name: Hardhat Localhost
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH

## Import a test account using a private key from Hardhat.

#### 📖 Usage
1. Connect Wallet
Click "Connect Wallet"
Approve MetaMask connection
2. Add Book (Owner Only)
Enter book details
Submit form
Book appears in catalogue
3. Purchase Book
Enter Book ID and quantity
Confirm transaction in MetaMask
Stock updates automatically
4. Get Book Details
Enter Book ID
View stored blockchain data
5. Withdraw Funds (Owner Only)
Withdraw ETH from contract balance


### 🧪 Code Quality

Code quality is maintained using ESLint integrated with Next.js.

Run:

```bash

npm run lint


The project is managed using Git and GitHub.


Dhwani
🔗 https://github.com/dhwanikayare
