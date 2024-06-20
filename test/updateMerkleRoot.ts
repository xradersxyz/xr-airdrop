import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("updateMerkleRoot start...");
  const contractAddress =
    process.env.MAIN_NET == "1"
      ? (process.env.CLAIM_CONTRACT_ADDRESS_MAINNET as string)
      : (process.env.CLAIM_CONTRACT_ADDRESS_TESTNET as string);

  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("claim.json", "utf8"))
  );

  const MerkleTreeClaim = await ethers.getContractAt(
    "MerkleTreeClaim",
    contractAddress
  );

  console.log("tree.root", tree.root);

  const merkleRoot = await MerkleTreeClaim.updateMerkleRoot(tree.root);
  console.log("updateMerkleRoot done.", merkleRoot);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
