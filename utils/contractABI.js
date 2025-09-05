// utils/contractABI.js
const contractJSON = require("../web3/artifacts/contracts/VotingDapp.sol/VotingDapp.json");

const VOTING_CONTRACT_ABI = contractJSON.abi;

module.exports = { VOTING_CONTRACT_ABI };
