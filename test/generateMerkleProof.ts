// import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const tree = StandardMerkleTree.load(
  JSON.parse(fs.readFileSync("claim.json", "utf8"))
);

console.log("Tree root:", tree);
console.log("Tree root:", tree.root);

for (const [i, v] of tree.entries()) {
  if (v[0] === "0xF3023840099527fb39d380C1B75896b449f089F9") {
    const proof = tree.getProof(i);
    console.log("Value:", v);
    console.log("Proof:", proof);
  }
}
