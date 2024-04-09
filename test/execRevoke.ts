import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? process.env.VESTING_CONTRACT_ADDRESS_MAINNET
      : process.env.VESTING_CONTRACT_ADDRESS_TESTNET;

  const revoekeUserAdderess = "0x4652E51697594F9f6D4E900c90bDD525c15B3BF0";

  const claims = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("claims.json", "utf8"))
  );

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress as string
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
