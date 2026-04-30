import { ethers } from "ethers";
import path from "path";

const contractJson = require(path.join(
  __dirname,
  "../../../artifacts/contracts/BookStore.sol/BookStore.json"
));

export const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

export const contractAddress =
  process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function getContract() {
  const signer = await provider.getSigner(0);

  return new ethers.Contract(
    contractAddress,
    contractJson.abi,
    signer
  );
}