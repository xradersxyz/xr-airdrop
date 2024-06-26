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

  console.log("Vesting Info contract address : ", contractAddress);

  try {
    // merkleRoot 값 가져오기
    const merkleRoot = await MerkleTokenVesting.merkleRoot();
    console.log("Vesting Info merkleRoot: ", merkleRoot);

    // token 주소 값 가져오기
    const tokenAddress = await MerkleTokenVesting.targetToken();
    console.log("Vesting Info target token: ", tokenAddress);

    // owner 값 가져오기
    const owner = await MerkleTokenVesting.owner();
    console.log("Vesting Info contract owner: ", owner);

    const vestingStart = await MerkleTokenVesting.vestingStart();
    console.log("Vesting Info contract owner: ", vestingStart);

    const vestingCliff = await MerkleTokenVesting.vestingCliff();
    console.log("Vesting Info contract owner: ", vestingCliff);

    const vestingDuration = await MerkleTokenVesting.vestingDuration();
    console.log("Vesting Info contract owner: ", vestingDuration);
  } catch (error) {
    console.error("Error fetching contract info: ", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
