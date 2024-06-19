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

  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("claim.json", "utf8"))
  );

  console.log("Deploying contracts with the account :", deployer.address);
  console.log("Deploying token address :", tokenAddress);
  console.log("Deploying tree root :", tree.root);

  const MerkleTreeClaim = await ethers.getContractFactory("MerkleTreeClaim");
  const merkleTreeClaim = await MerkleTreeClaim.deploy(
    initialOwner,
    tokenAddress,
    tree.root
  );

  console.log(
    "Deployed token contracts address:",
    await merkleTreeClaim.getAddress()
  );
  console.log(
    `npx hardhat verify --network ${(await deployer.provider.getNetwork()).name} ${await merkleTreeClaim.getAddress()} ${initialOwner} ${tokenAddress} ${tree.root}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
