// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GainxReedemToken is ERC20, ERC20Burnable, Ownable {
    constructor(address _escrowAddr) payable ERC20("GainxReedem", "RGNX") {
        _mint(_escrowAddr, 1000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) payable public onlyOwner {
        _mint(to, amount);
    }
}