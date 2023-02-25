// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TestNft is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 MAX_SUPPLY = 500;

    constructor() ERC721("TestNft", "TNT") {
    }

    function safeMint(address to) public{
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= MAX_SUPPLY, "Sold Out");
        _safeMint(to, tokenId);
    }

    function maxSupply() public view returns(uint256 supply){
        return MAX_SUPPLY;
    }

    function getCurrentCount() public view returns (uint256 count) {
        return _tokenIdCounter.current();
    }




}