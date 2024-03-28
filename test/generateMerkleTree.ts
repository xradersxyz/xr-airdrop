import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

/**
 * add claim users
 */
const addresses = [
  ["0xF3023840099527fb39d380C1B75896b449f089F9", "100"],
  ["0x4652E51697594F9f6D4E900c90bDD525c15B3BF0", "10"],
  ["0xfcc2889e8daaDd74481f3FfDbC7eDf5795448b22", "120"],
  ["0x3539CFd942fcC01cb8D5AA1511dC6b3E3f2fDDDe", "200"],
];

const tree = StandardMerkleTree.of(addresses, ["address", "uint256"]);
console.log(`Merkle Root: ${tree.root}`);
console.log(tree.render());
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
