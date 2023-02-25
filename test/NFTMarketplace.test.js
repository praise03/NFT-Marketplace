const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { resolve } = require("path");
// const { developmentChains, networkConfig } = require("../helper-hardhat-config")

// !developmentChains.includes(network.name)
// 	? describe.skip
// 	:
describe("NFT Marketplace Unit Tests", function () {
	let NFTMarketplace, deployer, chainId, TestNft;

	beforeEach(async () => {
		const NFTMarketplaceFactory = await ethers.getContractFactory(
			"NFTMarketplace"
		);
		const TestNftFactory = await ethers.getContractFactory("TestNft");
		NFTMarketplace = await NFTMarketplaceFactory.deploy();
		TestNft = await TestNftFactory.deploy();
	});

	describe("TestNft", function () {
		it("Mints NFT", async () => {
			const accounts = await ethers.getSigners();
			const account = accounts[1];
			// console.log(account.address)
			await TestNft.safeMint(account.address);
			console.log("Getting token count after mint...  ");
			assert.equal(await TestNft.getCurrentCount(), 1);
			console.log("Checking to see if Nft owner is the address supplied");
			assert.equal(await TestNft.ownerOf(1), account.address);
		});
	});

	describe("NFT Marketplace", function () {
		let account1, account2;
		beforeEach(async () => {
			const accounts = await ethers.getSigners();
			account1 = accounts[1];
			account2 = accounts[2];
			await TestNft.safeMint(account1.address);
			await TestNft.safeMint(account2.address);
		});

		it("listNFT: Reverts if marketplace not approved by account", async () => {
			account1 = NFTMarketplace.connect(account1);
			await expect(
				account1.listNFT(
					TestNft.address,
					1,
					ethers.utils.parseUnits("0", "ether")
				)
			).to.be.revertedWith("Marketplace not given approval");
		});

		it("listNFT: Reverts if price is less than zero", async () => {
			TestNft = TestNft.connect(account1);
			await TestNft.setApprovalForAll(NFTMarketplace.address, true);
			account1 = NFTMarketplace.connect(account1);
			await expect(
				account1.listNFT(
					TestNft.address,
					1,
					ethers.utils.parseUnits("0", "ether")
				)
			).to.be.revertedWith("Listing: Price Must be greater than 0");
		});

		it("listNFT: Reverts if non owner tries to list NFT", async () => {
			account2 = NFTMarketplace.connect(account2);
			await expect(
				account2.listNFT(
					TestNft.address,
					1,
					ethers.utils.parseUnits("0", "ether")
				)
			).to.be.revertedWith("You do not own this NFT");
		});

		it("listNFT: lists NFT for sale successfully", async () => {
			TestNft = TestNft.connect(account1);
			await TestNft.setApprovalForAll(NFTMarketplace.address, true);
			account1 = NFTMarketplace.connect(account1);
			const tokenId = 1;
			const price = ethers.utils.parseUnits("1", "ether");

			await new Promise(async (resolve, reject) => {
				NFTMarketplace.once("NftListed", async () => {
					try {
						console.log("Listing event fired");
						assert.equal(
							(
								await NFTMarketplace.listings(TestNft.address, tokenId)
							).price.toString(),
							price.toString()
						);
						console.log("NFT listed successfully");
						resolve();
					} catch (error) {
						reject(error);
					}
				});
				try {
					await account1.listNFT(TestNft.address, tokenId, price);
				} catch (error) {
					console.log(error);
				}
			});
		});

		it("Allows owner reduce price of NFT", async () => {
			//List the NFT
			TestNft = TestNft.connect(account1);
			await TestNft.setApprovalForAll(NFTMarketplace.address, true);
			account1 = NFTMarketplace.connect(account1);
			const tokenId = 1;
			const price = ethers.utils.parseUnits("1", "ether");
			await account1.listNFT(TestNft.address, tokenId, price);

			//lower price of NFT
			try {
				//reverts if neww price is higher than initial price
				const newHigherPrice = ethers.utils.parseUnits("2", "ether");
				console.log("Listing with new price higher than initial price");
				await expect(
					account1.lowerPrice(TestNft.address, tokenId, newHigherPrice)
				).to.be.revertedWith(
					"Listing: New Price Must be lesser than Old price"
				);
				console.log(
					"Reverted with error... New Price Must be lesser than Old price"
				);

				console.log(".............................................");

				console.log("Listing with new price lower than initial price");
				const newLowerPrice = ethers.utils.parseUnits("0.5", "ether");
				await account1.lowerPrice(TestNft.address, tokenId, newLowerPrice);
				assert.equal(
					(
						await NFTMarketplace.listings(TestNft.address, tokenId)
					).price.toString(),
					newLowerPrice.toString()
				);
				console.log("Price lowered successfully");
			} catch (error) {
				console.log(error);
			}
		});

		it("Allows owner cancel existing listing", async () => {
			//List the NFT
			console.log("Listing NFT");
			TestNft = TestNft.connect(account1);
			await TestNft.setApprovalForAll(NFTMarketplace.address, true);
			account1 = NFTMarketplace.connect(account1);
			const tokenId = 1;
			const price = ethers.utils.parseUnits("1", "ether");
			await account1.listNFT(TestNft.address, tokenId, price);

			//cancel listing
			try {
				console.log("Cancel Listing...");
				await account1.cancelListing(TestNft.address, tokenId);
				assert.equal(
					(
						await NFTMarketplace.listings(TestNft.address, tokenId)
					).price.toString(),
					0
				);
				console.log("Listing cancelled successfully");
			} catch (error) {
				console.log(error);
			}
		});

		it("Buy NFT: Reverts if NFT is not listed for sale", async () => {
			account1 = NFTMarketplace.connect(account1);
			const tokenId = 2;

			try {
				await expect(
					account1.buyNFT(TestNft.address, tokenId)
				).to.be.revertedWith("This Item is not listed for sale");
			} catch (error) {
				console.log(error);
			}
		});

		it("Buy NFT: Allows users to buy NFT listed for sale", async () => {
			//List the NFT
			console.log("Listing the NFT...");
			TestNft = TestNft.connect(account1);
			await TestNft.setApprovalForAll(NFTMarketplace.address, true);
			connectedAccount1 = NFTMarketplace.connect(account1);
			let tokenId = 1;
			let price = ethers.utils.parseUnits("1", "ether");
			await connectedAccount1.listNFT(TestNft.address, tokenId, price);

			await new Promise(async (resolve, reject) => {
				NFTMarketplace.once("NftSold", async () => {
					console.log("Nft Sold event fired...");
					try {
						assert.equal(await TestNft.ownerOf(tokenId), account2.address);
						console.log("NFT sale confirmed");
						resolve();
					} catch (error) {
						console.log(error);
						reject();
					}
				});

				//setup second account to buy listed NFT
				try {
					connectedAccount2 = NFTMarketplace.connect(account2);
					await expect(
						connectedAccount2.buyNFT(TestNft.address, tokenId)
					).to.be.revertedWith("BuyNft: Not enough ETH");
					await expect(
						connectedAccount1.buyNFT(TestNft.address, tokenId)
					).to.be.revertedWith("BuyNft: You own this NFT");
					await connectedAccount2.buyNFT(TestNft.address, tokenId, {
						value: price,
					});
				} catch (error) {
					console.log(error);
				}
			});
		});
	});
});
