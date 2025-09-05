const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with:", deployer.address);

  // ✅ Deploy without arguments
  const Voting = await hre.ethers.getContractFactory("VotingDapp");
  const voting = await Voting.deploy();

  await voting.deployed();

  console.log("✅ Voting contract deployed to:", voting.address);
  console.log("✅ Owner set to:", await voting.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
