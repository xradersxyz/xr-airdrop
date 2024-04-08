import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress =
    process.env.MAIN_NET == "1"
      ? "0xBAc35614Db92dce58d33dadc0D34090eE28aB5EE"
      : "0xB3B91598242EFEB02b922837aD1C0d3d3159D499";

  const claims = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("claims.json", "utf8"))
  );

  const MerkleTokenVesting = await ethers.getContractAt(
    "MerkleTokenVesting",
    contractAddress
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
        //Call only once initially. Call if you are eligible for vesting and have proof.
        const claimAwardTx = await MerkleTokenVesting.claimAward(
          v[0]["index"],
          v[0]["address"],
          v[0]["amount"],
          v[0]["revocable"],
          proof
        );
        await claimAwardTx.wait();

        console.log("registe claimAward.\n", claimAwardTx);
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
