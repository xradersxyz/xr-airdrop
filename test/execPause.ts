import { ethers } from "hardhat";

async function main() {
  console.log(`pause : start1`);
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? (process.env.CLAIM_CONTRACT_ADDRESS_MAINNET as string)
      : (process.env.CLAIM_CONTRACT_ADDRESS_TESTNET as string);

  const MerkleTreeClaim = await ethers.getContractAt(
    "MerkleTreeClaim",
    contractAddress
  );

  console.log(`pause : start`);
  const pause = await MerkleTreeClaim.pause();
  console.log(`pause : ${pause}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
