"use client";
import React, { useState } from "react";
import { registerVoter, getVoterDetails } from "../utils/contract";

export default function RegisterVoter() {
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Brave/MetaMask not detected!");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setStatus(`Wallet connected: ${accounts[0]}`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to connect wallet.");
    }
  };

  // Register voter
  const handleRegister = async () => {
    if (!account || !name) return alert("Enter your name and connect wallet first!");
    setStatus("⏳ Registering...");
    const res = await registerVoter(account, name);
    setStatus(res.msg);

    // Fetch voter details
    const details = await getVoterDetails(account);
    if (details) {
      setStatus(`✅ Registered as ${details.name}. Status: ${["Pending","Approved","Rejected"][details.status]}`);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Register Voter</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">Connected: {account}</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button
            onClick={handleRegister}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Register as Voter
          </button>
        </div>
      )}

      {status && <p className="mt-4 text-gray-800">{status}</p>}
    </div>
  );
}
