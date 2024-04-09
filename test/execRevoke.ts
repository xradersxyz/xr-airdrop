import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? "0xBAc35614Db92dce58d33dadc0D34090eE28aB5EE"
      : "0xB3B91598242EFEB02b922837aD1C0d3d3159D499";

  const revoekeUserAdderess = "0x4652E51697594F9f6D4E900c90bDD525c15B3BF0";

  const claims = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("claims.json", "utf8"))
  );

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress
  );

  const revokeTx = await MerkleTokenVesting.revoke(revoekeUserAdderess);
  await revokeTx.wait();
  console.log(`Has user vested amount : ${revokeTx}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
