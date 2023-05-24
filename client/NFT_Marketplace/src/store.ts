import { defineStore } from "pinia";
import { Contract, ethers } from "ethers";
import constants from "./constants";
import { NFTMarketplace__factory } from "../../../types/factories/contracts/NFTMarketplace__factory";
import { TestNft__factory } from "../../../types/factories/contracts/TestNft__factory";
import {NFTMarketplaceInterface} from "../../../types/contracts/NFTMarketplace"
import {TestNftInterface} from "../../../types/contracts/TestNft"
const SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/kA2CDbe4C9vQ9NnfWS6V1M2xJU7SAW86"

declare let window: any;

export const webStore = defineStore({
    id: "webStore",
    state: () => ({
        testNFT : undefined as any,
        NFTMarketplace: undefined as any,
        currentAccount: String,
    }),
    actions : {
        async loadTestNFT() {
            let provider
            if (!window.ethereum) {
                provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
                this.testNFT = TestNft__factory.connect(
                    constants.testAddress,
                    provider
                );
            } else {
                provider = new ethers.providers.Web3Provider(
                    window.ethereum as any,
                    "sepolia"
                );
                this.testNFT = TestNft__factory.connect(
                    constants.testAddress,
                    provider.getSigner()
                );
            }
        },

        async loadNFTMarketplace(){
            let provider
            if (!window.ethereum) {
                provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
                this.NFTMarketplace = NFTMarketplace__factory.connect(
                    constants.contractAddress,
                    provider
                );
            } else {
                provider = new ethers.providers.Web3Provider(
                    window.ethereum as any,
                    "sepolia"
                );
                this.NFTMarketplace = NFTMarketplace__factory.connect(
                    constants.contractAddress,
                    provider.getSigner()
                );
            }
        },

        async isConnectedToSepolia(){
            const targetNetworkId = "0xaa36a7";
            if (window.ethereum){
                
                const checkNetwork = async () => {
                    const currentChainId = await window.ethereum.request({
                        method: "eth_chainId",
                    });
                
                    if (currentChainId == targetNetworkId) return true;
                    return false;
                };
                const switchNetwork = async () => {
                    await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: targetNetworkId }],
                    });
                    window.location.reload();
                };
                if (!await checkNetwork()) {
                    alert("You need to switch to the Sepolia Testnet");

                    switchNetwork();
                }
            }
        }
    }

})