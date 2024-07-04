import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("update vesting date start...");
  const contractAddress =
    process.env.MAIN_NET == "1"
      ? (process.env.VESTING_CONTRACT_ADDRESS_MAINNET as string)
      : (process.env.VESTING_CONTRACT_ADDRESS_TESTNET as string);

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress
  );

  const startDate = new Date("2024-07-12T00:00:00Z");
  const start = Math.floor(startDate.getTime() / 1000); // Set specified start date relative to UTC
  const cliff = 0; // Cliff period: 60 * 60 * 24 * 90 90 days
  const duration = 60 * 60 * 24 * 153; // Total vesting period: 90 days

  const vestingDate = await MerkleTokenVesting.updateVestingDate(
    start,
    cliff,
    duration
  );
  console.log("update vesting date done.", vestingDate);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
