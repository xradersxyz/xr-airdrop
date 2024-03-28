import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

/**
 * add claim users
 */
const claims = [
  [
    {
      index: "0",
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      amount: "5000000",
      revocable: "true",
    },
  ],
  [
    {
      index: "1",
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      amount: "1000000",
      revocable: "false",
    },
  ],
  [
    {
      index: "2",
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      amount: "3000000",
      revocable: "true",
    },
  ],
  [
    {
      index: "3",
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      amount: "4000000",
      revocable: "false",
    },
  ],
];

const tree = StandardMerkleTree.of(claims, [
  "tuple(uint256 index, uint256 address, uint256 amount, bool revocable)",
]);
console.log(`Merkle Root: ${tree.root}`);
console.log(tree.render());
fs.writeFileSync("claims.json", JSON.stringify(tree.dump()));
