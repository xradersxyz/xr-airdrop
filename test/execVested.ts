import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? process.env.VESTING_CONTRACT_ADDRESS_MAINNET
      : process.env.VESTING_CONTRACT_ADDRESS_TESTNET;

  const claims = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("vesting.json", "utf8"))
  );

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress as string
  );

  const vestedAmount = await MerkleTokenVesting.getVestedAmount(
    deployer.address
  );
  console.log(`Has user vested amount : ${ethers.formatEther(vestedAmount)}`);

  for (const [i, v] of claims.entries()) {
    if (v[0]["address"] === deployer.address) {
      const proof = claims.getProof(i);
      console.log("index:", v[0]["index"]);
      console.log("address:", v[0]["address"]);
      console.log("amount:", v[0]["amount"]);
      console.log("revocable:", v[0]["revocable"]);
      console.log("Proof:", proof);

      const awards = MerkleTokenVesting.awards(deployer.address);
      console.log(`Awards Info : ${awards}`);

      const isClaimed = await MerkleTokenVesting.isClaimed(v[0]["index"]);
      console.log(`isClaimed Info : ${isClaimed}`);

      if (isClaimed) {
        const releasableAmount = await MerkleTokenVesting.getReleasableAmount(
          deployer.address
        );

        console.log(
          `Has user releasable amount : ${ethers.formatEther(releasableAmount)}`
        );

        if (releasableAmount > 0) {
          console.log("Claiming vested tokens...");
          const release = await MerkleTokenVesting.release(deployer.address);
          await release.wait();
          console.log("Vested tokens claimed successfully.\n", release);
        } else {
          console.log("There are no vesting tokens to claim.\n");
        }
      } else {
        //Call only once initially. Call if you are eligible for vesting and have proof.
        const verifyTx = await MerkleTokenVesting.verify(
          v[0]["index"],
          v[0]["address"],
          v[0]["amount"],
          v[0]["revocable"],
          proof
        );
        await verifyTx.wait();

        console.log("reg verify.\n", verifyTx);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
