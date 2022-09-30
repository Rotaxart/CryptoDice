// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiceCoin is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("DIceCoin", "DCE") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

}

