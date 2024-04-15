// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

interface IConnectToken {
    function connectToOtherContracts(address[] calldata contracts) external;
}
