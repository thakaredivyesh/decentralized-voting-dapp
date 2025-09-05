"use client";
import React, { useEffect, useState } from "react";
import { getAllApprovedCandidates, voteCandidate } from "../utils/contract";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // ✅ Fetch approved candidates
  const fetchCandidates = async () => {
    setLoading(true);
    const list = await getAllApprovedCandidates();
    setCandidates(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // ✅ Handle vote
  const handleVote = async (candidateAddress) => {
  setLoading(true);
  try {
    const res = await voteCandidate(candidateAddress, "My vote"); // ✅ pass message
    alert(res.msg);
    fetchCandidates();
  } catch (err) {
    console.error(err);
    alert("Failed to vote. Maybe you already voted?");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Approved Candidates</h1>

      {loading ? (
        <p>Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <p>No approved candidates found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
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

      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
}
