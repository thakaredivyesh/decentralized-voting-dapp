const { ethers } = require("ethers");
const { VOTING_CONTRACT_ABI } = require("../utils/contractABI");
const contractAddress = require("../utils/contractAddress.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = provider.getSigner(0); // MetaMask first account
  const contract = new ethers.Contract(contractAddress.address, VOTING_CONTRACT_ABI, signer);

  const candidateAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const candidateName = "Alice";

  try {
    // ✅ 1. Check owner
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    console.log("🔑 Contract Owner:", owner);
    console.log("📝 Your Wallet   :", signerAddress);

    if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
      console.log("❌ You are NOT the contract owner. Only the owner can register candidates.");
      return;
    }

    // ✅ 2. Register candidate
    let tx = await contract.registerCandidate(candidateAddress, candidateName);
    await tx.wait();
    console.log(`✅ Candidate ${candidateName} registered successfully!`);

    // ✅ 3. Approve candidate
    tx = await contract.approveCandidate(candidateAddress);
    await tx.wait();
    console.log(`✅ Candidate ${candidateName} approved successfully!`);

    // ✅ 4. Fetch approved candidates
    const addresses = await contract.getAllApprovedCandidates();
    console.log("✅ Approved candidates:", addresses);

  } catch (err) {
    console.error("Error:", err);
  }
}

main();
