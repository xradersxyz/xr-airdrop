// import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const tree = StandardMerkleTree.load(
  JSON.parse(fs.readFileSync("tree.json", "utf8"))
);

console.log("Tree root:", tree.root);

for (const [i, v] of tree.entries()) {
  if (v[0] === "0x3539CFd942fcC01cb8D5AA1511dC6b3E3f2fDDDe") {
    const proof = tree.getProof(i);
    console.log("Value:", v);
    console.log("Proof:", proof);
  }
}
