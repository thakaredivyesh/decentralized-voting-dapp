"use client";
import React, { useEffect, useState } from "react";
import { getAllApprovedCandidates, voteCandidate, getVoterDetails } from "../utils/contract";

export default function VotePage() {
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("");

  const fetchCandidates = async () => {
    const list = await getAllApprovedCandidates();
    setCandidates(list);
  };

  const checkVoter = async () => {
    if (!account) return;
    const voter = await getVoterDetails(account);
    if (!voter) return setStatus("⚠️ Not registered as voter");
    if (voter.status !== 1) return setStatus("⚠️ You are not approved yet.");
    if (voter.hasVoted) return setStatus("✅ You already voted.");
    setStatus("✅ You can vote!");
  };

  useEffect(() => {
    const load = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) setAccount(accounts[0]);
      }
      await fetchCandidates();
    };
    load();
  }, []);

  useEffect(() => {
    checkVoter();
  }, [account]);

  const handleVote = async (addr) => {
    setStatus("⏳ Voting...");
    const res = await voteCandidate(addr, "My vote");
    setStatus(res.msg);
    fetchCandidates();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Vote</h1>

      <p className="mb-4 text-gray-700">{status}</p>

      {candidates.length === 0 ? (
        <p>No approved candidates.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Votes</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={i}>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border truncate max-w-xs">{c.candidateAddress}</td>
                <td className="p-2 border text-center">{c.voteCount}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleVote(c.candidateAddress)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Vote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
