import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import keccak256 from "keccak256";
import fs from "fs";

const tree = StandardMerkleTree.load(
  JSON.parse(fs.readFileSync("tree.json", "utf8"))
);

console.log("Tree root:", tree.root);

for (const [i, v] of tree.entries()) {
  if (v[0] === "0x4652E51697594F9f6D4E900c90bDD525c15B3BF0") {
    const proof = tree.getProof(i);
    console.log("Value:", v);
    console.log("Proof:", proof);

    //   const leaf = keccak256(
    //     ethers.utils.defaultAbiCoder.encode(["address", "uint256", "bool"], [targetClaim.address, targetClaim.amount, targetClaim.revocable])
    //   );

    //   bytes32 leaf = keccak256(
    //     bytes.concat(keccak256(ethers.AbiCoder.encode(v[0], v[1])))
    // );
  }
}
