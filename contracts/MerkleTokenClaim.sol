// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract MerkleTreeClaim is Ownable, ReentrancyGuard, Pausable {
    IERC20 public token;
    bytes32 public merkleRoot;

    mapping(address => bool) public claimed;
    mapping(address => uint256) public claimedAmount;

    event Claimed(address indexed claimant, uint256 amount);

    /**
     *
     * @param initialOwner The owner to be set
     * @param _token The token contrect address to be set
     * @param _merkleRoot The merkle root to be set
     */
    constructor(
        address initialOwner,
        IERC20 _token,
        bytes32 _merkleRoot
    ) Ownable(initialOwner) {
        token = _token;
        merkleRoot = _merkleRoot;
    }

    /**
     * Occurs when a claim token is rewarded to the beneficiary.
     * @param amount The amount to be set
     * @param merkleProof The proof to be set
     */
    function claim(
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external nonReentrant {
        require(!claimed[msg.sender], "Already claimed.");
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, amount)))
        );
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid proof."
        );

        claimed[msg.sender] = true;
        claimedAmount[msg.sender] += amount;
        token.transfer(msg.sender, amount);

        emit Claimed(msg.sender, amount);
    }

    /**
     *
     * @param account The address to be set
     */
    function getClaimedAmount(address account) external view returns (uint256) {
        return claimedAmount[account];
    }

    /**
     *
     * @param account The address to be set
     * @param amount The amount to be set
     * @param merkleProof The merkleProof to be set
     * @return uint256 Return unclaimed token quantity
     */
    function getUnclaimedAmount(
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external view whenNotPaused returns (uint256) {
        if (claimed[account]) {
            return 0; //If a claim has already been made
        }
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(account, amount)))
        );

        bool valid = MerkleProof.verify(merkleProof, merkleRoot, leaf);
        if (!valid) {
            return 0; //If Merkle Proof is invalid
        }
        return amount;
    }

    /**
     * A function that allows the contract owner to withdraw all tokens deposited in the contract
     */
    function withdrawAll() public onlyOwner whenNotPaused {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Transfer failed");
    }

    /**
     * Merkle Root update function (for administrators)
     * @param _newMerkleRoot The new Merkle root to be set
     */
    function updateMerkleRoot(
        bytes32 _newMerkleRoot
    ) external onlyOwner whenNotPaused {
        merkleRoot = _newMerkleRoot;
    }
}
