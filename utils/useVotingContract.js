import { ethers } from "ethers";
import { VOTING_CONTRACT_ABI } from "./contractABI";
import contractAddress from "./contractAddress.json"; // {"address": "0x..."}

// ✅ Returns contract instance using wallet signer (Brave/MetaMask)
export const getVotingContract = async () => {
  if (!window.ethereum) throw new Error("Brave Wallet / MetaMask not installed!");

  // Web3 provider from wallet
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // Connect contract
  return new ethers.Contract(contractAddress.address, VOTING_CONTRACT_ABI, signer);
};
