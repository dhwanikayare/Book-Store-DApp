# Decentralized Book Store Management System

![Ethereum Smart Contract](https://img.shields.io/badge/Ethereum%20Smart%20Contract-Yes-success.svg)
![MetaMask](https://img.shields.io/badge/MetaMask-Ready-blue.svg)
![Hardhat](https://img.shields.io/badge/Hardhat-Ready-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-13.0.0-blueviolet.svg)

---

## Overview

This project is a decentralized Book Store Management System built using Ethereum smart contracts and a modern web frontend.

The system allows users to interact with a blockchain-based bookstore where books can be added, purchased, and retrieved. It demonstrates full integration between a frontend application and a blockchain backend using MetaMask and ethers.js.

---

## Key Features

- Add books (owner only)
- Purchase books using ETH
- View individual book details
- Display all available books (catalogue)
- Withdraw contract funds (owner only)
- Role-based access control (owner vs user)
- Real-time blockchain interaction

---

## Technologies Used

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Ethers.js

### Backend
- Solidity
- Hardhat

### Blockchain & Tools
- Ethereum (Hardhat local test network)
- MetaMask

---

## Smart Contract Functionality

The BookStore smart contract includes:

- `addBook()` – Adds new books (owner only)
- `purchaseBook()` – Allows users to buy books using ETH
- `getBook()` – Retrieves book details
- `getAllBooks()` – Returns full book catalogue
- `withdrawFunds()` – Owner withdraws contract balance

Additional improvements:
- Input validation using `require`
- Ownership control using `onlyOwner`
- Event logging for transactions
- Purchase tracking using mappings

---

## Getting Started

### Prerequisites

To run this application locally:

- Node.js (LTS recommended)
- MetaMask extension
- Hardhat
- Git

---

### Installation

## Clone your repository:


git clone https://github.com/dhwanikayare/Book-Store-DApp.git
cd Book-Store-DApp


## Install dependencies:


`npm install`



### Smart Contract Setup

## Compile the smart contract:

`npx hardhat compile`

## Start local blockchain:

`npx hardhat node`

## Deploy contract (in a new terminal):

`npx hardhat run scripts/deploy.ts --network localhost`

## Copy the deployed contract address.

## Environment Configuration

## Create .env.local:

`NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS`

## Run Frontend
`npm run dev`

## Open:

`http://localhost:3000`
### MetaMask Configuration

## Add Hardhat network:

`Network Name: Hardhat Localhost`
`RPC URL: http://127.0.0.1:8545`
`Chain ID: 31337`
`Currency Symbol: ETH`

## Import a test account using a private key from Hardhat.

## Usage
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

### Code Quality

## Code quality is maintained using ESLint integrated with Next.js. This ensures consistent coding standards and reduces potential errors.

Run:

`npm run lint`

### Version Control

## The project is managed using Git and hosted on GitHub. Development was tracked through multiple commits reflecting:

Smart contract enhancements
Frontend improvements
Blockchain interaction fixes
Final integration and testing
Future Improvements
Deploy to public testnet (e.g., Sepolia)
Add search and filtering
Improve UI/UX further
Add transaction history
Implement user authentication

Author

Dhwani 
GitHub: https://github.com/dhwanikayare


---

