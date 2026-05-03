// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Minimal ERC-721 agent token for the yard (ERC-7857-compatible story left to metadata).
contract AgentNFT is ERC721Enumerable, Ownable {
    constructor(
        address initialOwner
    ) ERC721("the yard Agent", "YARD") Ownable(initialOwner) {}

    function mint(address to, uint256 tokenId) external onlyOwner {
        _safeMint(to, tokenId);
    }
}
