import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress =
    process.env.MAIN_NET == "1"
      ? "0xBAc35614Db92dce58d33dadc0D34090eE28aB5EE"
      : "0xB3B91598242EFEB02b922837aD1C0d3d3159D499";

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress
  );

  const withdrawAllTx = await MerkleTokenVesting.withdrawAll();
  console.log(`withdrawAll : ${withdrawAllTx}`);
}
