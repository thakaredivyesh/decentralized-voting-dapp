"use client";
import { useState, useEffect } from "react";
import { getVotingContract } from "../utils/useVotingContract";
import { ethers } from "ethers";

export default function Home() {
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState(""); // ✅ Added missing state
  const [hardhatAccounts, setHardhatAccounts] = useState([]);

  // ✅ Fetch Hardhat accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        const accounts = await provider.listAccounts();
        setHardhatAccounts(accounts);
      } catch (err) {
        console.error("Failed to fetch Hardhat accounts:", err);
      }
    };

    fetchAccounts();
  }, []);

  // ✅ Connect Wallet + Auto-switch to Hardhat
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Brave Wallet / MetaMask not installed!");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      // Hardhat local chainId = 0x7a69 (31337) or 0x539 (1337)
      if (chainId !== "0x7a69" && chainId !== "0x539") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x7a69" }],
        });
        setStatus("✅ Switched to Hardhat Localhost (31337)");
      }

      setAccount(accounts[0]);
      setStatus("✅ Wallet connected: " + accounts[0]);
    } catch (err) {
      console.error(err);
      setStatus("❌ Wallet connection failed: " + err.message);
    }
  };

  // ✅ Register Candidate
  const handleRegisterCandidate = async () => {
    if (!candidateName || !candidateAddress) {
      return alert("Enter candidate name and select an address");
    }

    try {
      const contract = await getVotingContract();
      const tx = await contract.registerCandidate(candidateAddress, candidateName);
      await tx.wait();

      setStatus(`✅ Candidate ${candidateName} registered!`);
      setCandidateName("");
      setCandidateAddress("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to register candidate: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Voting DApp</h1>

      {/* Wallet Connection */}
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg mr-2"
      >
        {account ? "Wallet Connected" : "Connect Wallet"}
      </button>

      {/* Candidate Registration */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="border p-2 mr-2 rounded"
        />

        <select
          value={candidateAddress}
          onChange={(e) => setCandidateAddress(e.target.value)}
          className="border p-2 mr-2 rounded"
        >
          <option value="">Select Candidate Address</option>
          {hardhatAccounts.map((addr, i) => (
            <option key={i} value={addr}>
              {addr}
            </option>
          ))}
        </select>

        <button
          onClick={handleRegisterCandidate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Register Candidate
        </button>
      </div>

      <p className="mt-4">{status}</p>
    </div>
  );
}
