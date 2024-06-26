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

  console.log("Claim Info contract address : ", contractAddress);

  try {
    // merkleRoot 값 가져오기
    const merkleRoot = await MerkleTreeClaim.merkleRoot();
    console.log("Claim Info merkleRoot: ", merkleRoot);

    // token 주소 값 가져오기
    const tokenAddress = await MerkleTreeClaim.token();
    console.log("Claim Info target token: ", tokenAddress);

    // owner 값 가져오기
    const owner = await MerkleTreeClaim.owner();
    console.log("Claim Info contract owner: ", owner);
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
