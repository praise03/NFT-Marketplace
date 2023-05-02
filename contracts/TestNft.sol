// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

contract TestNft is ERC721, Ownable {
    event NftMinted(uint256 tokenId, address owner);

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 MAX_SUPPLY = 69;
    string public baseTokenURI;
    string public uriSuffix = ".json";

    constructor() ERC721("TestNft", "TNT") {
        baseTokenURI = "";
    }

    function safeMint(address to) public {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= MAX_SUPPLY, "Sold Out");
        _safeMint(to, tokenId);

        emit NftMinted(tokenId, to);
    }

    function maxSupply() public view returns (uint256 supply) {
        return MAX_SUPPLY;
    }

    function getCurrentCount() public view returns (uint256 count) {
        return _tokenIdCounter.current();
    }

    function setBaseTokenURI(string memory _newBaseTokenURI) public onlyOwner {
        baseTokenURI = _newBaseTokenURI;
    }

    function _baseTokenURI()
        internal
        view
        returns (string memory)
    {
        return baseTokenURI;
    }

    function tokenCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(_tokenId), "Unexistent token");
        string memory currentBaseTokenURI = _baseTokenURI();
        return
            bytes(currentBaseTokenURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseTokenURI,
                        Strings.toString(_tokenId),
                        uriSuffix
                    )
                )
                : "";
    }
}
