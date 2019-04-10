pragma solidity ^0.5.7;

contract ItToken {
    uint256 public totalSupply;
    constructor() public {
        totalSupply = 1000000000; // 1 billion
    }
}
