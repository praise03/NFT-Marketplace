// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace {
    struct Listing {
        address owner;
        uint256 price;
    }

    event NftListing(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address owner
    );

    event NftSale(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address seller,
        address buyer
    );

    event NftCancel(address nftAddress, uint256 tokenId, address owner);

    mapping(address => mapping(uint256 => Listing)) public listings;

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        ERC721 NFTcollection = ERC721(nftAddress);
        require(
            NFTcollection.ownerOf(tokenId) == owner,
            "You do not own this NFT"
        );
        _;
    }

    modifier isMarketplaceApproved(address nftAddress) {
        ERC721 NFTcollection = ERC721(nftAddress);
        bool isApprovedForAll = NFTcollection.isApprovedForAll(
            msg.sender,
            address(this)
        );
        require(isApprovedForAll, "Marketplace not given approval");
        _;
    }

    modifier isNFTListed(address nftAddress, uint256 tokenId) {
        require(
            listings[nftAddress][tokenId].price > 0,
            "This Item is not listed for sale"
        );
        _;
    }

    function listNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        public
        isOwner(nftAddress, tokenId, msg.sender)
        isMarketplaceApproved(nftAddress)
    {
        require(price > 0, "Listing: Price Must be greater than 0");
        require(
            listings[nftAddress][tokenId].price == 0,
            "This Item is already listed for sale"
        );

        listings[nftAddress][tokenId] = Listing(msg.sender, price);

        emit NftListing(nftAddress, tokenId, price, msg.sender);
    }

    function lowerPrice(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        public
        isOwner(nftAddress, tokenId, msg.sender)
        isMarketplaceApproved(nftAddress)
        isNFTListed(nftAddress, tokenId)
    {
        require(newPrice > 0, "Listing: New Price Must be greater than 0");

        require(
            listings[nftAddress][tokenId].price > newPrice,
            "Listing: New Price Must be lesser than Old price"
        );

        listings[nftAddress][tokenId].price = newPrice;

        emit NftListing(nftAddress, tokenId, newPrice, msg.sender);
    }

    function buyNFT(address nftAddress, uint256 tokenId)
        public
        payable
        isNFTListed(nftAddress, tokenId)
    {
        Listing memory listing = listings[nftAddress][tokenId];
        require(msg.sender != listing.owner, "BuyNft: You own this NFT");
        require(msg.value == listing.price, "BuyNft: Not enough ETH");

        IERC721(nftAddress).safeTransferFrom(
            listing.owner,
            msg.sender,
            tokenId
        );

        delete (listings[nftAddress][tokenId]);

        emit NftSale(nftAddress, tokenId, msg.value, listing.owner, msg.sender);
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        public
        isOwner(nftAddress, tokenId, msg.sender)
        isNFTListed(nftAddress, tokenId)
    {
        delete (listings[nftAddress][tokenId]);
        emit NftCancel(nftAddress, tokenId, msg.sender);
    }

    function getListing(address nftAddress, uint256 tokenId)
        public
        view
        returns (Listing memory)
    {
        Listing memory listn = listings[nftAddress][tokenId];
        return listn;
    }
}
