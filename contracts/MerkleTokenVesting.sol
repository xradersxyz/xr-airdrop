// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./abstract/TokenVesting.sol";
import "./abstract/MerkleDistributor.sol";
import "./interface/IBunzz.sol";

contract MerkleTokenVesting is TokenVesting, MerkleDistributor, IBunzz {
    event Claimed(
        uint256 index,
        address account,
        uint256 amount,
        bool revocable
    );

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to beneficiaries gradually in a linear fashion until _start + _duration. By then all
     * of the balance will have vested.
     * @param start start block to begin vesting
     * @param cliff cliff to start vesting on, set to zero if immediately after start
     * @param duration duration in blocks to vest over
     */
    constructor(
        address initialOwner,
        uint256 start,
        uint256 cliff,
        uint256 duration,
        bytes32 merkleRoot
    )
        TokenVesting(start, cliff, duration)
        Ownable(initialOwner)
        MerkleDistributor(merkleRoot)
    {}

    function connectToOtherContracts(
        address[] memory otherContracts
    ) external override onlyOwner {
        _setTokenContract(otherContracts[0]);
    }

    function claimAward(
        uint256 index,
        address account,
        uint256 amount,
        bool revocable,
        bytes32[] calldata merkleProof
    ) external {
        require(!isClaimed(index), "Award already claimed");

        // Verify the merkle proof.
        // bytes32 node = keccak256(
        //     abi.encodePacked(index, account, amount, revocable)
        // );

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(account, amount, revocable)))
        );

        _verifyClaim(merkleProof, leaf);

        _setClaimed(index);

        _awardTokens(account, amount, revocable);

        emit Claimed(index, account, amount, revocable);
    }
}
