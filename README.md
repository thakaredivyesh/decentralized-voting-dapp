
# Decentralized Voting DApp

A simple decentralized voting application built with Solidity smart contracts and a JavaScript frontend. This DApp allows an owner to register and approve candidates and voters, set a voting period, and lets approved voters cast votes on the blockchain.

## Features

- **Owner Controls**
  - Register, approve, and reject candidates
  - Register, approve, and reject voters
  - Set voting period (start and end time)

- **Voter Features**
  - Register as a voter using your wallet
  - Approved voters can vote for approved candidates during the voting period

- **Candidate Features**
  - Candidates can be registered and approved by the owner

- **Admin Panel**
  - Manage voters: approve or reject registrations

- **Smart Contract Security**
  - Only the owner can manage candidates/voters and set the voting period
  - Transactions are verified on-chain

## Tech Stack

- **Smart Contract:** Solidity (`VotingDapp.sol`)
- **Frontend:** React / JavaScript
- **Blockchain:** Hardhat local testnet (Ethereum-compatible)
- **Wallet:** MetaMask / Brave Wallet
- **UI:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js & npm
- Hardhat
- MetaMask or Brave Wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thakaredivyesh/decentralized-voting-dapp.git
   cd decentralized-voting-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd web3
   npm install
   cd ..
   ```

3. **Start Hardhat local node**
   ```bash
   cd web3
   npx hardhat node
   ```

4. **Deploy the contract**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Run the frontend**
   ```bash
   npm run dev
   ```

## Usage

- **Connect your wallet** (MetaMask/Brave) on the frontend.
- **Register as a voter** and wait for approval by the owner.
- **Owner**: Register and approve candidates and voters via the admin panel.
- **Set voting period** as owner.
- **Vote for candidates** during the voting period if you are an approved voter.

## Project Structure

```
web3/                 # Smart contract & Hardhat config
  ├── contracts/      # Solidity contracts
  ├── scripts/        # Deployment and control scripts
  └── artifacts/      # Compiled contract artifacts
components/           # React components (Admin panel, Sidebar, etc.)
pages/                # Next.js pages (index, register-voter, etc.)
utils/                # Contract interaction helpers (ABI, address)
config/               # Wallet/connect config
```

## Key Smart Contract Functions

- `registerCandidate(address, name)`
- `approveCandidate(address)`
- `registerVoter(address, name)`
- `approveVoter(address)`
- `setVotingPeriod(startTime, endTime)`
- `vote(candidateAddress, message)`
- Data retrieval: `getAllRegisteredCandidates`, `getCandidateDetails`, `getAllRegisteredVoters`, `getVoterDetails`

## License

MIT

---

Feel free to contribute or open issues for suggestions or improvements!
