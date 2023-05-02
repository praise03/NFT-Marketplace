import { defineStore } from "pinia";
import { Contract, ethers } from "ethers";
import constants from "./constants";


const SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/kA2CDbe4C9vQ9NnfWS6V1M2xJU7SAW86"

export const webStore = defineStore({
    id: "webStore",
    state: () => ({
        testNFT : Contract,
        NFTMarketplace: ethers.Contract,
        currentAccount: String,
    }),
    actions : {
        async loadTestNFT() {
            let provider
            if (!window.ethereum) {
                provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
            } else {
                provider = new ethers.providers.Web3Provider(
                    window.ethereum as any,
                    "sepolia"
                );
            }
            this.testNFT = await new ethers.Contract(constants.testAddress, constants.testAbi, provider.getSigner())
        },

        async loadNFTMarketplace(){
            let provider
            if (!window.ethereum) {
                provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
            } else {
                provider = new ethers.providers.Web3Provider(
                    window.ethereum as any,
                    "sepolia"
                );
            }
            this.NFTMarketplace = await new ethers.Contract(constants.contractAddress, constants.abi, provider.getSigner())
            
        },
    }

})