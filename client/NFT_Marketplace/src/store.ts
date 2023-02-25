import { defineStore } from "pinia";
import { Contract, ethers } from "ethers";
import constants from "./constants";


export const webStore = defineStore({
    id: "webStore",
    state: () => ({
        testNFT : Contract,
        NFTMarketplace: ethers.Contract,
        currentAccount: String,
    }),
    actions : {
        async loadTestNFT() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            this.testNFT = await new ethers.Contract(constants.testAddress, constants.testAbi, provider.getSigner())
        },

        async loadNFTMarketplace(){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            this.NFTMarketplace = await new ethers.Contract(constants.contractAddress, constants.abi, provider.getSigner())
            
        },
    }

})