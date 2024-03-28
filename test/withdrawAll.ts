import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x98439204670b302E873d7c274581207020B37294";

  const MerkleTreeClaim = await ethers.getContractAt(
    "MerkleTreeClaim",
    contractAddress
  );

  const withdrawAllTx = await MerkleTreeClaim.withdrawAll();
  console.log(`withdrawAll : ${withdrawAllTx}`);
}
