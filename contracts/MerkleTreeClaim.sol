// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MerkleTreeClaim is Ownable {
    IERC20 public token;
    bytes32 public merkleRoot;
    uint8 public decimals = 18;

    mapping(address => bool) public claimed;
    mapping(address => uint256) public claimedAmount;

    event Claimed(address indexed claimant, uint256 amount);

    constructor(
        address initialOwner,
        IERC20 _token,
        bytes32 _merkleRoot
    ) Ownable(initialOwner) {
        token = _token;
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 amount, bytes32[] calldata merkleProof) external {
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
        token.transfer(msg.sender, amount * (10 ** uint256(decimals)));

        emit Claimed(msg.sender, amount * (10 ** uint256(decimals)));
    }

    function getClaimedAmount(address account) external view returns (uint256) {
        return claimedAmount[account];
    }

    function getUnclaimedAmount(
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external view returns (bool, uint256) {
        if (claimed[account]) {
            return (false, 0); // 이미 클레임한 경우
        }
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(account, amount)))
        );

        bool valid = MerkleProof.verify(merkleProof, merkleRoot, leaf);
        if (!valid) {
            return (false, 0); // Merkle Proof가 유효하지 않은 경우
        }
        return (true, amount); // 미수령 토큰 수량 반환
    }

    /**
     * Merkle Root 업데이트 함수 (관리자용)
     * @param _newMerkleRoot
     **/
    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        merkleRoot = _newMerkleRoot;
    }
}
