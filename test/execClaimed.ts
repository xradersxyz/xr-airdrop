import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? "0x71391f3F61a98735bc28F84F3999F921979437B0"
      : "0x71391f3F61a98735bc28F84F3999F921979437B0";

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
  console.log(`Has user claimed amount : ${ethers.formatEther(claimedAmount)}`);

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
        console.log(
          `Unclaimed amount for user is: ${ethers.formatEther(unclaimedAmount)} tokens`
        );

        const claimTx = await MerkleTreeClaim.claim(v[1], proof);
        await claimTx.wait();
        console.log("Tx :", claimTx);

        // Asynchronous redundant function execution test code
        // for (let i = 0; i < 10; i++) {
        //   try {
        //     console.log(`Attempting claim #${i + 1}...`);
        //     const tx = await MerkleTreeClaim.claim(v[1], proof);
        //     // await tx.wait();
        //     console.log(`Claim #${i + 1} successful`);
        //   } catch (error) {
        //     console.error(`Claim #${i + 1} failed:`, error);
        //   }
        // }
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
