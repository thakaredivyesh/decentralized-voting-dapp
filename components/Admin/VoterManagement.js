// components/admin/VoterManagement.js
import React, { useEffect, useState } from "react";
import { getAllVoters, approveVoter, rejectVoter } from "../../utils/contract";

const VoterManagement = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch voters from contract
  const fetchVoters = async () => {
    setLoading(true);
    const list = await getAllVoters();
    setVoters(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  // Handle approve
  const handleApprove = async (address) => {
    const res = await approveVoter(address);
    alert(res.msg);
    fetchVoters();
  };

  // Handle reject
  const handleReject = async (address) => {
    const res = await rejectVoter(address);
    alert(res.msg);
    fetchVoters();
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Voter Management</h2>

      {loading ? (
        <p>Loading voters...</p>
      ) : voters.length === 0 ? (
        <p>No voters registered yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Has Voted</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter, i) => (
              <tr key={i} className="border">
                <td className="p-2 border">{voter.address}</td>
                <td className="p-2 border">{voter.name}</td>
                <td className="p-2 border">
                  {voter.status === 0
                    ? "Pending"
                    : voter.status === 1
                    ? "Approved"
                    : "Rejected"}
                </td>
                <td className="p-2 border">{voter.hasVoted ? "✅" : "❌"}</td>
                <td className="p-2 border space-x-2">
                  {voter.status === 0 && (
                    <>
                      <button
                        onClick={() => handleApprove(voter.address)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(voter.address)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {voter.status === 1 && <span className="text-green-600">✔ Approved</span>}
                  {voter.status === 2 && <span className="text-red-600">✘ Rejected</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VoterManagement;
