// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @notice Registry for listing, sale, and rental of agent NFTs (USDC only; no Uniswap in-contract).
contract YardRegistry {
    IERC721Enumerable public immutable nft;
    IERC20 public immutable usdc;

    struct ListingData {
        address seller;
        uint256 salePrice;
        uint256 rentalPerDay;
        bool listed;
        address renter;
        uint256 rentalExpiry;
        string ensName;
        string description;
        string storageHash;
        string axlPeerId;
        uint8 strategy;
    }

    mapping(uint256 tokenId => ListingData) private _listings;
    uint256[] public listedTokenIds;
    mapping(address user => uint256[]) private renterTokens;

    error NotOwner();
    error NotForSale();
    error BadPrice();
    error TransferFailed();
    error NotRentable();
    error BadRentPrice();
    error StillRented();
    error NotRenter();
    error NotExpired();

    constructor(address _nft, address _usdc) {
        nft = IERC721Enumerable(_nft);
        usdc = IERC20(_usdc);
    }

    function getListedCount() external view returns (uint256) {
        return listedTokenIds.length;
    }

    function _removeListed(uint256 tokenId) internal {
        uint256 len = listedTokenIds.length;
        for (uint256 i = 0; i < len; ++i) {
            if (listedTokenIds[i] == tokenId) {
                listedTokenIds[i] = listedTokenIds[len - 1];
                listedTokenIds.pop();
                return;
            }
        }
    }

    function _appendListed(uint256 tokenId) internal {
        uint256 len = listedTokenIds.length;
        for (uint256 i = 0; i < len; ++i) {
            if (listedTokenIds[i] == tokenId) return;
        }
        listedTokenIds.push(tokenId);
    }

    function listAgent(
        uint256 tokenId,
        uint256 salePrice,
        uint256 rentalPerDay,
        string calldata ensName,
        string calldata description,
        string calldata storageHash,
        string calldata axlPeerId,
        uint8 strategy
    ) external {
        if (nft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        ListingData storage li = _listings[tokenId];
        li.seller = msg.sender;
        li.salePrice = salePrice;
        li.rentalPerDay = rentalPerDay;
        li.listed = true;
        li.ensName = ensName;
        li.description = description;
        li.storageHash = storageHash;
        li.axlPeerId = axlPeerId;
        li.strategy = strategy;
        _appendListed(tokenId);
    }

    function purchaseAgent(uint256 tokenId, uint256 usdcAmount) external {
        ListingData storage li = _listings[tokenId];
        if (!li.listed || li.salePrice == 0) revert NotForSale();
        if (usdcAmount != li.salePrice) revert BadPrice();
        address seller = nft.ownerOf(tokenId);
        if (seller != li.seller) revert NotOwner();
        if (!usdc.transferFrom(msg.sender, seller, usdcAmount)) revert TransferFailed();
        IERC721(address(nft)).safeTransferFrom(seller, msg.sender, tokenId);
        li.listed = false;
        li.seller = msg.sender;
        _removeListed(tokenId);
    }

    function rentAgent(uint256 tokenId, uint256 daysCount, uint256 usdcAmount) external {
        ListingData storage li = _listings[tokenId];
        if (li.rentalPerDay == 0) revert NotRentable();
        uint256 total = li.rentalPerDay * daysCount;
        if (usdcAmount != total) revert BadRentPrice();
        if (li.renter != address(0) && block.timestamp < li.rentalExpiry) revert StillRented();
        address seller = nft.ownerOf(tokenId);
        if (!usdc.transferFrom(msg.sender, seller, total)) revert TransferFailed();
        li.renter = msg.sender;
        li.rentalExpiry = block.timestamp + daysCount * 1 days;
        li.seller = seller;
        renterTokens[msg.sender].push(tokenId);
    }

    function expireRental(uint256 tokenId) external {
        ListingData storage li = _listings[tokenId];
        if (li.renter == address(0)) revert NotRenter();
        if (block.timestamp < li.rentalExpiry) revert NotExpired();
        li.renter = address(0);
        li.rentalExpiry = 0;
    }

    function hasAccess(uint256 tokenId, address user) external view returns (bool) {
        address owner = nft.ownerOf(tokenId);
        if (owner == user) return true;
        ListingData storage li = _listings[tokenId];
        return li.renter == user && block.timestamp < li.rentalExpiry;
    }

    function getListing(uint256 tokenId) external view returns (ListingData memory) {
        return _listings[tokenId];
    }

    function rentalsOf(address user) external view returns (uint256[] memory) {
        return renterTokens[user];
    }
}
