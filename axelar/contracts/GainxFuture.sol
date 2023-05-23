// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract GainxFuture {
    mapping(uint256 => uint256) public escrowToApy;

    function _lockFutureApy(uint256 _escrowId, uint256 _apy) payable public {
        escrowToApy[_escrowId] = _apy;
    }
}