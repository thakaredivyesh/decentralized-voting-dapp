// scripts/transferOwner.js
const { ethers } = require("hardhat");

async function main() {
  // ✅ Your Brave wallet address (replace with your exact address)
  const newOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  // ✅ Contract address (check artifacts/deploy output or hardhat console)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get deployer (account[0] from Hardhat node)
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  // Connect to contract
  const VotingDapp = await ethers.getContractAt("VotingDapp", contractAddress, deployer);

  // Call changeOwner
  const tx = await VotingDapp.changeOwner(newOwner);
  await tx.wait();

  console.log(`✅ Ownership transferred to ${newOwner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
