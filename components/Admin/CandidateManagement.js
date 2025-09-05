// components/admin/CandidateManagement.js
import React, { useEffect, useState } from "react";
import { getVotingContract } from "../../utils/contract";

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      const contract = getVotingContract();
      const addresses = await contract.getAllRegisteredCandidates();
      const details = await Promise.all(
        addresses.map(async (addr) => {
          const [candidateAddress, name, status, voteCount, message] =
            await contract.getCandidateDetails(addr);
          return {
            candidateAddress,
            name,
            status: Number(status), // 0=Pending,1=Approved,2=Rejected
            voteCount: Number(voteCount),
            message,
          };
        })
      );
      setCandidates(details);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  const handleApprove = async (addr) => {
    try {
      const contract = getVotingContract();
      const tx = await contract.approveCandidate(addr);
      await tx.wait();
      alert("✅ Candidate approved!");
      fetchCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (addr) => {
    try {
      const contract = getVotingContract();
      const tx = await contract.rejectCandidate(addr);
      await tx.wait();
      alert("❌ Candidate rejected!");
      fetchCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const statusLabel = ["Pending", "Approved", "Rejected"];

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Candidate Management</h2>
      {candidates.length === 0 ? (
        <p>No candidates registered.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Votes</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={i}>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border truncate max-w-xs">{c.candidateAddress}</td>
                <td className="p-2 border">{statusLabel[c.status]}</td>
                <td className="p-2 border">{c.voteCount}</td>
                <td className="p-2 border space-x-2">
                  {c.status === 0 && (
                    <>
                      <button
                        onClick={() => handleApprove(c.candidateAddress)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(c.candidateAddress)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CandidateManagement;
