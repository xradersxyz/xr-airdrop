import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? (process.env.CLAIM_CONTRACT_ADDRESS_MAINNET as string)
      : (process.env.CLAIM_CONTRACT_ADDRESS_TESTNET as string);

  const MerkleTreeClaim = await ethers.getContractAt(
    "MerkleTreeClaim",
    contractAddress
  );

  const withdrawAllTx = await MerkleTreeClaim.withdrawAll();
  console.log(`withdrawAll : ${withdrawAllTx}`);
}
