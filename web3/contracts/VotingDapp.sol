// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Decentralized Voting DApp
/// @notice Owner can register/approve/reject candidates and voters. Approved voters can vote during the voting period.
/// @dev Keep it simple and gas-conscious for a starter project.

contract VotingDapp {
    address public owner;

    enum ApprovalStatus { Pending, Approved, Rejected }

    struct Candidate {
        address candidateAddress;
        string name;
        ApprovalStatus status;
        uint256 voteCount;
        string message; // optional metadata
    }

    struct Voter {
        address voterAddress;
        string name;
        ApprovalStatus status;
        bool hasVoted;
    }

    // storage
    mapping(address => Candidate) private candidates;
    address[] private candidateList;

    mapping(address => Voter) private voters;
    address[] private voterList;

    // voting period
    uint256 public startTime;
    uint256 public endTime;

    // events
    event CandidateRegistered(address indexed candidate, string name);
    event CandidateApproved(address indexed candidate);
    event CandidateRejected(address indexed candidate);
    event VoterRegistered(address indexed voter, string name);
    event VoterApproved(address indexed voter);
    event VoterRejected(address indexed voter);
    event Voted(address indexed voter, address indexed candidate, uint256 voteCount, string message);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event VotingPeriodSet(uint256 startTime, uint256 endTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyDuringVoting() {
        require(startTime != 0 && block.timestamp >= startTime, "Voting not started");
        require(endTime == 0 || block.timestamp <= endTime, "Voting ended");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // OWNER ACTIONS: register and approve/reject candidates
    function registerCandidate(address _candidateAddress, string calldata _name) external onlyOwner {
        require(_candidateAddress != address(0), "Zero address");
        if (bytes(candidates[_candidateAddress].name).length == 0) {
            candidateList.push(_candidateAddress);
        }
        candidates[_candidateAddress] = Candidate({
            candidateAddress: _candidateAddress,
            name: _name,
            status: ApprovalStatus.Pending,
            voteCount: 0,
            message: ""
        });
        emit CandidateRegistered(_candidateAddress, _name);
    }

    function approveCandidate(address _candidateAddress) external onlyOwner {
        require(bytes(candidates[_candidateAddress].name).length != 0, "Candidate not registered");
        candidates[_candidateAddress].status = ApprovalStatus.Approved;
        emit CandidateApproved(_candidateAddress);
    }

    function rejectCandidate(address _candidateAddress) external onlyOwner {
        require(bytes(candidates[_candidateAddress].name).length != 0, "Candidate not registered");
        candidates[_candidateAddress].status = ApprovalStatus.Rejected;
        emit CandidateRejected(_candidateAddress);
    }

    // OWNER ACTIONS: register and approve/reject voters
    function registerVoter(address _voterAddress, string calldata _name) external onlyOwner {
        require(_voterAddress != address(0), "Zero address");
        if (bytes(voters[_voterAddress].name).length == 0) {
            voterList.push(_voterAddress);
        }
        voters[_voterAddress] = Voter({
            voterAddress: _voterAddress,
            name: _name,
            status: ApprovalStatus.Pending,
            hasVoted: false
        });
        emit VoterRegistered(_voterAddress, _name);
    }

    function approveVoter(address _voterAddress) external onlyOwner {
        require(bytes(voters[_voterAddress].name).length != 0, "Voter not registered");
        voters[_voterAddress].status = ApprovalStatus.Approved;
        emit VoterApproved(_voterAddress);
    }

    function rejectVoter(address _voterAddress) external onlyOwner {
        require(bytes(voters[_voterAddress].name).length != 0, "Voter not registered");
        voters[_voterAddress].status = ApprovalStatus.Rejected;
        emit VoterRejected(_voterAddress);
    }

    // Voting control
    function setVotingPeriod(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(_endTime == 0 || _endTime > _startTime, "Invalid end time");
        startTime = _startTime;
        endTime = _endTime;
        emit VotingPeriodSet(_startTime, _endTime);
    }

    function changeOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

    function resetContract() external onlyOwner {
        // resets times, but keeps lists; you can extend this to clear arrays if desired
        startTime = 0;
        endTime = 0;
    }

    // Voting
    /// @param _candidateAddress candidate to vote for
    /// @param _message optional message attached to the vote
    function vote(address _candidateAddress, string calldata _message) external onlyDuringVoting {
        Voter storage v = voters[msg.sender];
        require(bytes(v.name).length != 0, "Not registered");
        require(v.status == ApprovalStatus.Approved, "Voter not approved");
        require(!v.hasVoted, "Already voted");

        Candidate storage c = candidates[_candidateAddress];
        require(bytes(c.name).length != 0, "Candidate not found");
        require(c.status == ApprovalStatus.Approved, "Candidate not approved");

        c.voteCount += 1;
        c.message = _message; // store last message (optional)
        v.hasVoted = true;

        emit Voted(msg.sender, _candidateAddress, c.voteCount, _message);
    }

    // Views - returning arrays of addresses + helper getters
    function getAllRegisteredCandidates() external view returns (address[] memory) {
        return candidateList;
    }

    function getAllApprovedCandidates() external view returns (address[] memory) {
        uint256 count;
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidates[candidateList[i]].status == ApprovalStatus.Approved) count++;
        }
        address[] memory out = new address[](count);
        uint256 idx;
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidates[candidateList[i]].status == ApprovalStatus.Approved) {
                out[idx++] = candidateList[i];
            }
        }
        return out;
    }

    function getCandidateDetails(address _candidate) external view returns (address, string memory, uint8, uint256, string memory) {
        Candidate storage c = candidates[_candidate];
        return (c.candidateAddress, c.name, uint8(c.status), c.voteCount, c.message);
    }

    function getAllRegisteredVoters() external view returns (address[] memory) {
        return voterList;
    }

    function getAllApprovedVoters() external view returns (address[] memory) {
        uint256 count;
        for (uint i = 0; i < voterList.length; i++) {
            if (voters[voterList[i]].status == ApprovalStatus.Approved) count++;
        }
        address[] memory out = new address[](count);
        uint256 idx;
        for (uint i = 0; i < voterList.length; i++) {
            if (voters[voterList[i]].status == ApprovalStatus.Approved) {
                out[idx++] = voterList[i];
            }
        }
        return out;
    }

    function getVoterDetails(address _voter) external view returns (address, string memory, uint8, bool) {
        Voter storage v = voters[_voter];
        return (v.voterAddress, v.name, uint8(v.status), v.hasVoted);
    }

    // convenience: check if address can vote now
    function getCurrentVotingStatus() external view returns (bool) {
        if (startTime == 0) return false;
        if (block.timestamp < startTime) return false;
        if (endTime != 0 && block.timestamp > endTime) return false;
        return true;
    }
}
