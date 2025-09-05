import { ethers } from "ethers";
import { VOTING_CONTRACT_ABI } from "./contractABI";

// Replace with your deployed contract address
const VOTING_CONTRACT_ADDRESS = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

// ✅ Get contract instance with signer
export const getVotingContract = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      VOTING_CONTRACT_ADDRESS,
      VOTING_CONTRACT_ABI,
      signer
    );
  }
  throw new Error("Brave Wallet / MetaMask not detected!");
};

// ✅ Register candidate
export const registerCandidate = async (candidateAddress, name) => {
  try {
    const contract = getVotingContract();
    const tx = await contract.registerCandidate(candidateAddress, name);
    await tx.wait();
    return { success: true, msg: `Candidate ${name} registered` };
  } catch (err) {
    console.error("Register candidate error:", err);
    return { success: false, msg: err.message };
  }
};

// ✅ Get all approved candidates
export const getAllApprovedCandidates = async () => {
  try {
    const contract = getVotingContract();
    const addresses = await contract.getAllApprovedCandidates();

    const candidates = await Promise.all(
      addresses.map(async (addr) => {
        const [candidateAddress, name, status, voteCount, message] =
          await contract.getCandidateDetails(addr);

        return {
          candidateAddress,
          name,
          status: Number(status), // 0=Pending, 1=Approved, 2=Rejected
          voteCount: Number(voteCount),
          message,
        };
      })
    );

    return candidates;
  } catch (err) {
    console.error("Fetch candidates error:", err);
    return [];
  }
};

// ✅ Vote for candidate
// Vote for candidate
export const voteCandidate = async (candidateAddress, message = "My vote") => {
  try {
    const contract = getVotingContract();
    const tx = await contract.vote(candidateAddress, message);
    await tx.wait();
    return { success: true, msg: `Vote cast for ${candidateAddress}` };
  } catch (err) {
    console.error("Vote error:", err);
    return { success: false, msg: err.message };
  }
};

// Register a voter
export const registerVoter = async (voterAddress, name) => {
  try {
    const contract = getVotingContract();
    const tx = await contract.registerVoter(voterAddress, name);
    await tx.wait();
    return { success: true, msg: `Voter ${name} registered!` };
  } catch (err) {
    console.error("Register voter error:", err);
    return { success: false, msg: err.message };
  }
};

// Get voter details
export const getVoterDetails = async (voterAddress) => {
  try {
    const contract = getVotingContract();
    const [address, name, status, hasVoted] = await contract.getVoterDetails(
      voterAddress
    );
    return {
      address,
      name,
      status: Number(status), // 0=pending, 1=approved, 2=rejected
      hasVoted,
    };
  } catch (err) {
    console.error("Get voter details error:", err);
    return null;
  }
};

// Get all registered voters
export const getAllVoters = async () => {
  try {
    const contract = getVotingContract();
    const addresses = await contract.getAllRegisteredVoters();

    const voters = await Promise.all(
      addresses.map(async (addr) => {
        const [voterAddress, name, status, hasVoted] =
          await contract.getVoterDetails(addr);
        return {
          address: voterAddress,
          name,
          status: Number(status), // 0=pending, 1=approved, 2=rejected
          hasVoted,
        };
      })
    );

    return voters;
  } catch (err) {
    console.error("Fetch voters error:", err);
    return [];
  }
};

// Approve voter
export const approveVoter = async (voterAddress) => {
  try {
    const contract = getVotingContract();
    const tx = await contract.approveVoter(voterAddress);
    await tx.wait();
    return { success: true, msg: `Voter ${voterAddress} approved!` };
  } catch (err) {
    console.error("Approve voter error:", err);
    return { success: false, msg: err.message };
  }
};

// Reject voter
export const rejectVoter = async (voterAddress) => {
  try {
    const contract = getVotingContract();
    const tx = await contract.rejectVoter(voterAddress);
    await tx.wait();
    return { success: true, msg: `Voter ${voterAddress} rejected!` };
  } catch (err) {
    console.error("Reject voter error:", err);
    return { success: false, msg: err.message };
  }
};

