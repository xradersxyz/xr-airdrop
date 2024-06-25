import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? (process.env.VESTING_CONTRACT_ADDRESS_MAINNET as string)
      : (process.env.VESTING_CONTRACT_ADDRESS_TESTNET as string);

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress
  );

  console.log("withdrawAll address", contractAddress);
  const withdrawAllTx = await MerkleTokenVesting.withdrawAll();
  console.log(`withdrawAll : ${withdrawAllTx}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
