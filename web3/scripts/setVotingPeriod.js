// scripts/setVotingPeriod.js
const hre = require("hardhat");

async function main() {
  // Replace with your deployed contract address
  const contractAddr = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

  // get the first account (deployer/owner)
  const [owner] = await hre.ethers.getSigners();

  // attach contract
  const contract = await hre.ethers.getContractAt("VotingDapp", contractAddr, owner);

  // set start = now, end = +1 hour
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;

  console.log(`⏳ Setting voting period: start=${now}, end=${now + oneHour}`);

  const tx = await contract.setVotingPeriod(now, now + oneHour);
  await tx.wait();

  console.log("✅ Voting period set successfully!");
  console.log("Start:", await contract.startTime());
  console.log("End:", await contract.endTime());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
