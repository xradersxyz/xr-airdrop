import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("updateMerkleRoot start...");
  const contractAddress =
    process.env.MAIN_NET == "1"
      ? (process.env.VESTING_CONTRACT_ADDRESS_MAINNET as string)
      : (process.env.VESTING_CONTRACT_ADDRESS_TESTNET as string);

  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("tree-xp-vesting-dev.json", "utf8"))
  );

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress
  );

  console.log("tree.root", tree.root);

  const merkleRoot = await MerkleTokenVesting.updateMerkleRoot(tree.root);
  console.log("updateMerkleRoot done.", merkleRoot);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
