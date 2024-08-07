# Merkle Tree Claim and Token Vesting Contracts

Merkle Tree Claim and Token Vesting Contracts
Overview
This project includes two main Solidity contracts: MerkleTreeClaim and MerkleTokenVesting. These contracts are designed to facilitate token distribution using a Merkle tree structure for claim verification and a vesting schedule to control the gradual release of tokens to beneficiaries.

MerkleTreeClaim Contract
The MerkleTreeClaim contract allows users to claim tokens based on a Merkle tree proof. This ensures that only users who are included in the Merkle tree can claim the tokens.

Key Features:
Token Distribution: Distributes tokens to users who can provide a valid Merkle tree proof.
Pause/Unpause: The contract owner can pause and unpause the contract.
Claim Verification: Uses Merkle proofs to verify claims and prevent double claims.
Admin Functions: Allows the contract owner to update the Merkle root and withdraw all tokens.
Functions:
constructor: Initializes the contract with the owner, token address, and Merkle root.
isClaimed: Checks if an account has already claimed tokens.
pause: Pauses the contract.
unpause: Unpauses the contract.
claim: Allows a user to claim tokens by providing a valid Merkle proof.
getClaimedAmount: Returns the amount claimed by an account.
getUnclaimedAmount: Returns the unclaimed amount for an account if the proof is valid.
withdrawAll: Allows the contract owner to withdraw all tokens.
updateMerkleRoot: Allows the contract owner to update the Merkle root.
MerkleTokenVesting Contract
The MerkleTokenVesting contract combines token vesting with Merkle tree-based distribution. This contract ensures that tokens are released gradually over a specified vesting period and only to those who provide a valid Merkle proof.

Key Features:
Token Vesting: Gradually releases tokens over a specified period.
Merkle Proof Verification: Ensures only valid claimants can receive tokens.
Admin Functions: Allows the contract owner to update the vesting schedule and Merkle root, and withdraw all tokens.
Functions:
constructor: Initializes the contract with the owner, vesting start, cliff, duration, and Merkle root.
connectToOtherContracts: Connects the contract to other token contracts.
withdrawAll: Allows the contract owner to withdraw all tokens.
verify: Verifies a claim using a Merkle proof and awards tokens if valid.
updateMerkleRoot: Allows the contract owner to update the Merkle root.
updateVestingDate: Allows the contract owner to update the vesting start date, cliff, and duration.
Usage
Deploying MerkleTreeClaim Contract
Deploy the MerkleTreeClaim contract with the token address and Merkle root.
Users can claim their tokens by providing a valid Merkle proof.
Deploying MerkleTokenVesting Contract
Deploy the MerkleTokenVesting contract with the initial owner, vesting start, cliff, duration, and Merkle root.
Connect the contract to the token contract using connectToOtherContracts.
Users can verify their claims using a Merkle proof and receive their tokens according to the vesting schedule.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Feel free to reach out if you have any questions or need further assistance with the deployment and usage of these contracts.
