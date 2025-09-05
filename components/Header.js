// components/Header.js
import React, { useEffect } from "react";
import { BellIcon } from "@heroicons/react/outline";

const Header = ({ account, setAccount }) => {
  // Auto-connect if already authorized
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkConnectedWallet();
  }, [setAccount]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet");
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Left: System Info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700">
          Decentralized Voting System
        </h2>
        <p className="text-sm text-gray-500">
          Secure • Transparent • Blockchain
        </p>
      </div>

      {/* Right: Wallet + Notifications */}
      <div className="flex items-center space-x-4">
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
        <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
