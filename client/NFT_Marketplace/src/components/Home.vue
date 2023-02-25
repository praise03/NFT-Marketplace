<template>
<div>

    

</div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import constants from "../constants"
import {ethers} from 'ethers'
import { useRouter, useRoute } from 'vue-router'


export default defineComponent({
    data() {
        return {
            currentAccount : null,
            accountConnected : null,
            contract : null,
            tokens: [],
            testNFT : null,
            price: null,
            listings: [],
            router : useRouter()
        }
    },

    methods: {
        owner(token) {
            const owner = Number(token) == Number(this.currentAccount)
            return owner
        },

        async connectWallet() {
            try {
                const { ethereum } = window;
                if(!ethereum){ alert("Metamask not installed"); return}
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                })
                console.log(accounts[0] + "connected");
                this.currentAccount = accounts[0]
            } catch (error){ console.log (error)}
        },

        async checkIfAccountConnected() {
            try {
                const { ethereum } = window;
                if(!ethereum){ alert("Metamask not installed"); return}

                const accounts = await ethereum.request({ method: "eth_accounts" });
                console.log(accounts.length)

                if(accounts.length !== 0) {
                    this.currentAccount = accounts[0]
                    this.accountConnected = true
                    console.log(this.currentAccount)
                }else{ this.accountConnected = false }
            }catch(error) {console.log(error)}
        },

        async callContract() {
            const res = await this.contract.returnAnything()
            console.log(res.toString())
        },

        async getNFT() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            this.testNFT = await new ethers.Contract(constants.testAddress, constants.testAbi, provider.getSigner())

            let loop = true
            let num = 0
            while (loop) {
                try {
                    const response = await this.testNFT.ownerOf(num);
                    const Item = {
                        id: num,
                        owner: response
                    }
                    this.tokens.push(Item)
                    ++num
                } catch (error) {
                    console.log("No more tokens") 
                    loop = false  
                }    
            }
            // const response = await TestNft.ownerOf(0);
            // console.log("here")
            // console.log(response)
        },

        async setApproval() {
            const Txreceipt = await this.testNFT.setApprovalForAll(this.contract.address, true)
            await Txreceipt.wait(1)
        },

        async ListItem (tokenId, price) {
            try {
                // console.log(this.currentAccount, this.contract.address)
                const approved = await this.testNFT.isApprovedForAll(this.currentAccount, this.contract.address)
                if (approved) {
                    const response = await this.contract.listNFT(this.testNFT.address, tokenId, ethers.utils.parseUnits(price,"ether"))
                    response.wait(1)
                    const newListing = await this.contract.getListing(this.testNFT.address, tokenId)
                    this.listings.push(newListing)
                    console.log("price: ", this.listings[0]["price"].toString())
                    console.log("Owner: ", this.listings[0]["owner"].toString())
                } else {
                    await this.setApproval()
                    this.ListItem(tokenId, price) 
                }
            
            } catch (error) {
                console.log(error)   
            }

        },

        async buyItem (tokenId) {
            try {
                const price = ethers.utils.parseUnits("0.1" ,"ether")
                const txResponse = await this.contract.buyNFT(this.testNFT.address, tokenId, { value: price })
                await txResponse.wait(1)
                console.log("new owner: ",await this.testNFT.ownerOf(tokenId))
            } catch (error) {
                console.log(error)
            }
        },

        async cancelListing(tokenId) {
            try {
                const txResponse = await this.contract.cancelListing(this.testNFT.address, tokenId)
                await txResponse.wait(1)
                const listing = await this.contract.getListing(this.testNFT.address, tokenId)
                console.log(listing["owner"].toString() )
            } catch (error) {
                console.log(error)
            }
        }



    },

    
    async created(){
        await this.checkIfAccountConnected()
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // const network = await provider.getNetwork();
        // const chainId = network.chainId;
        // console.log(chainId)
        


        this.contract = await new ethers.Contract(constants.contractAddress, constants.abi, provider.getSigner())
        // console.log(this.contract.address)

        await this.getNFT()
    }
})
</script>
