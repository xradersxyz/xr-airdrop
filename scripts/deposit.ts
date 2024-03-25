import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const tokenAddress = process.env.BSC_CONTRACT_ADDRESS as string;
  const contractAddress = "0xB68EAa753E6D13960a7a2287D991E98dD8d63e42";
  const depositAmount = ethers.parseUnits("100", 18);

  // ERC20 토큰 컨트랙트 인터페이스 로드
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    ],
    signer
  );

  // 컨트랙트에 토큰을 입금하기 전에, 먼저 컨트랙트가 사용자의 토큰을 대신 전송할 수 있도록 승인(Approve)합니다.
  console.log("Approving tokens...");
  const approveTx = await tokenContract.approve(contractAddress, depositAmount);
  console.log("Tokens approved", approveTx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
