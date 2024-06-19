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

  const startDate = new Date("2024-04-18T03:00:00Z");
  const start = Math.floor(startDate.getTime() / 1000); // Set specified start date relative to UTC
  const cliff = 0; // Cliff period: 60 * 60 * 24 * 90 90 days
  const duration = 60 * 60 * 24 * 7; // Total vesting period: 90 days

  const claims = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("vesting.json", "utf8"))
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
