import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x4216726c7D9e8F509eAfC402dF6fdF1735E2D4b2";
  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("tree.json", "utf8"))
  );

  const MerkleTreeClaim = await ethers.getContractAt(
    "MerkleTreeClaim",
    contractAddress
  );

  const hasClaimed = await MerkleTreeClaim.claimed(deployer.address);
  console.log(`Has user already claimed : ${hasClaimed}`);

  const claimedAmount = await MerkleTreeClaim.claimedAmount(deployer.address);
  console.log(`Has user claimed amount : ${claimedAmount}`);

  for (const [i, v] of tree.entries()) {
    if (v[0] === deployer.address) {
      const proof = tree.getProof(i);
      console.log("Value:", v);
      console.log("Proof:", proof);

      const [valid, unclaimedAmount] = await MerkleTreeClaim.getUnclaimedAmount(
        deployer.address,
        v[1],
        proof
      );
      if (valid) {
        console.log(`Unclaimed amount for user is: ${unclaimedAmount} tokens`);
        // ethers.parseUnits("0.00000000000000001", 18);
        const claimTx = await MerkleTreeClaim.claim(v[1], proof);
        await claimTx.wait();
        console.log("Tx :", claimTx);
      } else {
        console.log("Invalid proof or user has already claimed.");
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
