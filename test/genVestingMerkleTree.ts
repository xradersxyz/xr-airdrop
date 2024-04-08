import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

/**
 * add claim users
 */
const claims = [
  [
    {
      index: "0",
      address: "0xF3023840099527fb39d380C1B75896b449f089F9",
      amount: "120000000000000000000",
      revocable: "true",
    },
  ],
  [
    {
      index: "1",
      address: "0x4652E51697594F9f6D4E900c90bDD525c15B3BF0",
      amount: "150000000000000000000",
      revocable: "true",
    },
  ],
  [
    {
      index: "2",
      address: "0xfcc2889e8daaDd74481f3FfDbC7eDf5795448b22",
      amount: "180000000000000000000",
      revocable: "true",
    },
  ],
  [
    {
      index: "3",
      address: "0x3539CFd942fcC01cb8D5AA1511dC6b3E3f2fDDDe",
      amount: "200216000000000000000",
      revocable: "true",
    },
  ],
];

const tree = StandardMerkleTree.of(claims, [
  "tuple(uint256 index, uint256 address, uint256 amount, bool revocable)",
]);
console.log(`Merkle Root: ${tree.root}`);
console.log(tree.render());
fs.writeFileSync("claims.json", JSON.stringify(tree.dump()));
