// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/finance/VestingWallet.sol";

// contract XrVestingWallet is VestingWallet {
//     IERC20 private _token;

//     struct BeneficiaryInfo {
//         uint256 amount;
//         uint64 start;
//         uint64 duration;
//         bool isSet;
//     }

//     mapping(address => BeneficiaryInfo) public beneficiaries;

//     constructor(IERC20 tokenAddress) VestingWallet(address(0), 0, 0) {
//         _token = tokenAddress;
//     }

//     function addBeneficiary(
//         address beneficiary,
//         uint256 amount,
//         uint64 start,
//         uint64 duration
//     ) public onlyOwner {
//         require(!beneficiaries[beneficiary].isSet, "Beneficiary already set");
//         beneficiaries[beneficiary] = BeneficiaryInfo(
//             amount,
//             start,
//             duration,
//             true
//         );
//     }

//     function addBeneficiaries(
//         address[] memory beneficiaryAddresses,
//         uint256[] memory amounts,
//         uint64[] memory starts,
//         uint64[] memory durations
//     ) public onlyOwner {
//         require(
//             beneficiaryAddresses.length == amounts.length,
//             "Arrays must have the same length"
//         );
//         require(
//             amounts.length == starts.length,
//             "Arrays must have the same length"
//         );
//         require(
//             starts.length == durations.length,
//             "Arrays must have the same length"
//         );

//         for (uint256 i = 0; i < beneficiaryAddresses.length; i++) {
//             addBeneficiary(
//                 beneficiaryAddresses[i],
//                 amounts[i],
//                 starts[i],
//                 durations[i]
//             );
//         }
//     }

//     function releaseForBeneficiary(address beneficiary) public {
//         require(beneficiaries[beneficiary].isSet, "Beneficiary not set");
//         BeneficiaryInfo storage info = beneficiaries[beneficiary];

//         // 베스팅 계산 로직 구현 필요
//         uint256 releasableAmount = calculateReleasableAmount(beneficiary);

//         _token.transfer(beneficiary, releasableAmount);
//     }

//     function calculateReleasableAmount(
//         address beneficiary
//     ) private view returns (uint256) {
//         BeneficiaryInfo storage info = beneficiaries[beneficiary];
//         if (block.timestamp < info.start) {
//             // 베스팅 시작 전이면 0 반환
//             return 0;
//         } else if (block.timestamp >= info.start + info.duration) {
//             // 베스팅 기간이 모두 경과했으면 총 베스팅량 반환
//             return info.amount;
//         } else {
//             // 선형 베스팅 계산: (현재 시간 - 시작 시간) / 베스팅 기간 * 총 베스팅량
//             uint256 elapsedTime = block.timestamp - info.start;
//             uint256 totalVestingTime = info.duration;
//             uint256 releasableAmount = (info.amount * elapsedTime) /
//                 totalVestingTime;
//             return releasableAmount;
//         }
//     }
// }
