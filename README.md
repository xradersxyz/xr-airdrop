# Merkle Tree Claim and Token Vesting Contracts

## Overview

This project includes two main Solidity contracts: `MerkleTreeClaim` and `MerkleTokenVesting`. These contracts are designed to facilitate claim verification using a Merkle tree structure and gradually distribute tokens according to a vesting schedule.

### MerkleTreeClaim Contract

The `MerkleTreeClaim` contract allows users to claim tokens based on Merkle tree proofs. This ensures that only users included in the Merkle tree can claim tokens.

#### Key Features:

- **Token Distribution:** Distributes tokens to users who provide valid Merkle tree proofs.
- **Pause/Unpause:** Allows the contract owner to pause or unpause the contract.
- **Claim Verification:** Verifies claims using Merkle proofs and prevents double claiming.
- **Admin Functions:** Enables the contract owner to update the Merkle root and withdraw all tokens.

#### Functions:

- **constructor**: Initializes the contract with the owner, token address, and Merkle root.
- **isClaimed**: Checks if an account has already claimed tokens.
- **pause**: Pauses the contract.
- **unpause**: Unpauses the contract.
- **claim**: Allows users to claim tokens by providing a valid Merkle proof.
- **getClaimedAmount**: Returns the amount claimed by an account.
- **getUnclaimedAmount**: Returns the unclaimed token amount if the proof is valid.
- **withdrawAll**: Allows the contract owner to withdraw all tokens.
- **updateMerkleRoot**: Allows the contract owner to update the Merkle root.

### MerkleTokenVesting Contract

The `MerkleTokenVesting` contract combines Merkle tree-based distribution with token vesting. This contract ensures that tokens are released gradually over a specified vesting period and only to users who provide valid Merkle proofs.

#### Key Features:

- **Token Vesting:** Gradually releases tokens over a specified period.
- **Merkle Proof Verification:** Ensures that only valid claimants receive tokens.
- **Admin Functions:** Allows the contract owner to update the vesting schedule and Merkle root, and withdraw all tokens.

#### Functions:

- **constructor**: Initializes the contract with the initial owner, vesting start, cliff, duration, and Merkle root.
- **connectToOtherContracts**: Connects the contract to other token contracts.
- **withdrawAll**: Allows the contract owner to withdraw all tokens.
- **verify**: Verifies claims using Merkle proofs and awards tokens if valid.
- **updateMerkleRoot**: Allows the contract owner to update the Merkle root.
- **updateVestingDate**: Allows the contract owner to update the vesting start date, cliff, and duration.

## Usage

### Deploying the MerkleTreeClaim Contract

1. Deploy the `MerkleTreeClaim` contract with the token address and Merkle root.
2. Users can claim tokens by providing a valid Merkle proof.

### Deploying the MerkleTokenVesting Contract

1. Deploy the `MerkleTokenVesting` contract with the initial owner, vesting start, cliff, duration, and Merkle root.
2. Connect the contract to the token contract using `connectToOtherContracts`.
3. Users can verify claims and receive tokens according to the vesting schedule by providing Merkle proofs.

### Example Deployment Script (Hardhat)

```javascript
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  const initialOwner = process.env.BSC_OWNER as string;

  const tokenAddress =
    process.env.MAIN_NET == "1"
      ? (process.env.XR_CONTRACT_ADDRESS_MAINNET as string)
      : (process.env.XR_CONTRACT_ADDRESS_TESTNET as string);

  const startDate = new Date("2024-06-23T00:00:00Z");
  const start = Math.floor(startDate.getTime() / 1000); // Set specified start date relative to UTC
  const cliff = 0; // Cliff period: 60 * 60 * 24 * 90 90 days
  const duration = 60 * 60 * 24 * 7; // Total vesting period: 90 days

  const claims = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("test.json", "utf8"))
  );

  console.log("Deploying contracts with the account :", deployer.address);
  console.log("Deploying token address :", tokenAddress);
  console.log("Deploying tree root :", claims.root);

  const MerkleTokenVesting =
    await ethers.getContractFactory("MerkleTokenVesting");
  const merkleTokenVesting = await MerkleTokenVesting.deploy(
    initialOwner,
    start,
    cliff,
    duration,
    claims.root
  );

  await merkleTokenVesting.waitForDeployment();

  console.log(
    "Deployed token contracts address:",
    await merkleTokenVesting.getAddress()
  );
  console.log(
    `npx hardhat verify --network ${(await deployer.provider.getNetwork()).name} ${await merkleTokenVesting.getAddress()} ${initialOwner} ${start} ${cliff} ${duration} ${claims.root}`
  );

  const setTokenTx = await merkleTokenVesting.connectToOtherContracts([
    tokenAddress,
  ]);
  await setTokenTx.wait();
  console.log(`Token contract ${tokenAddress} connected to MerkleTokenVesting`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

Feel free to contact us if you have any questions or need further assistance regarding deployment and usage.
