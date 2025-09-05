// components/Vote/CandidateCard.js
import React from "react";

const CandidateCard = ({ candidate }) => {
  return (
    <div className="p-4 bg-white rounded shadow text-gray-800">
      <h3 className="text-lg font-semibold">{candidate.name}</h3>
      <p>Address: {candidate.address}</p>
      <p>Age: {candidate.age}</p>
      <p>Party: {candidate.party}</p>
      <p>Votes: {candidate.votes}</p>
    </div>
  );
};

export default CandidateCard;
