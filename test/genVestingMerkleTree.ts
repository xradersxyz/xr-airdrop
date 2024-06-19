import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

/**
 * add claim users
 */
const claims = [
  [
    {
      index: "0",
      address: "0xC371c6872BA399e8487bD65C8dd1F310C13D6bb8",
      amount: "100000000000000000000",
      revocable: "true",
    },
  ],
  [
    {
      index: "1",
      address: "0x14b40524601C2F28a94178BF30adF60e42aA5270",
      amount: "200000000000000000000",
      revocable: "true",
    },
  ],
];

const tree = StandardMerkleTree.of(claims, [
  "tuple(uint256 index, uint256 address, uint256 amount, bool revocable)",
]);
console.log(`Merkle Root: ${tree.root}`);
console.log(tree.render());
fs.writeFileSync("vesting.json", JSON.stringify(tree.dump()));
