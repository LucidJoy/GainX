// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract GainxPool {

    function poolBalance() public view returns(uint256){
        return address(this).balance;
    }

    function receiveFunds() payable public {}

    function sendFunds(address _receiver, uint256 _amount) payable public { 
        // amount will be paid in TFil by adding APY to the core amount
        // amount = core amount + APY from borrower + APY from pool (starts after time ends)
        (bool sent, ) = _receiver.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
    
    // APY of the pool depends upon the ratio between GainxToken trade volume to Total worth of NFTs locked in GainX escrows
    // GainX token trade volume per block / Total worth of NFTs in escrow during the block

    // Scenario 1: Trade volume >>> Total worth --> APY will shoot up for lenders and borrowers will suffer
    // Scenario 2: Trade volume <<< Total worth --> APY will go down for lenders and borrowers will enjoy
}