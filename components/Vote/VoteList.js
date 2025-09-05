// components/Vote/VoteList.js
import React, { useEffect, useState } from "react";
import CandidateCard from "./CandidateCard";
import { getAllCandidates } from "../../utils/contract";

const VoteList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getAllCandidates();
        setCandidates(data);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading) return <p className="text-gray-800">Loading candidates...</p>;
  if (candidates.length === 0) return <p className="text-gray-800">No candidates available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidates.map((c) => (
        <CandidateCard key={c.address} candidate={c} />
      ))}
    </div>
  );
};

export default VoteList;
