const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const VotingDapp = await ethers.getContractFactory("VotingDapp");
  const voting = await VotingDapp.deploy();
  await voting.deployed();

  console.log("VotingDapp deployed at:", voting.address);

  // Save contract address to utils/contractAddress.json (in project root)
  const addressFile = path.join(__dirname, "../../utils/contractAddress.json");
  fs.writeFileSync(
    addressFile,
    JSON.stringify({ address: voting.address }, null, 2)
  );

  console.log(`Contract address saved to ${addressFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
