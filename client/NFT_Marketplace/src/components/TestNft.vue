<template>
    <div class=" border-2" >
        <div class="p-2 space-y-2">
          <div class="flex flex-row p-2">
            <p class="font-thin">Tokens Minted:</p>
            <p class="ml-2 font-bold">{{currentCounter}}/{{totalSupply}}</p>
          </div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Address To</label>
            <input v-model="addressTo" type="text" class="bg-gray-50 w-2/4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0x" required>
            
            <button @click="mintTo(addressTo)" class="px-6 py-2 bg-blue-600 rounded-md text-white">Mint</button>
        </div>


        <div class="p-2 space-y-2">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Token Id</label>
            <input v-model="tokenId" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0x" required>
            
            <button @click="getOwner(tokenId)" class="px-6 py-2 bg-blue-600 rounded-md text-white mt-5">Get Owner</button>
        </div>
    </div>
</template>


<script setup lang="ts">
    import {ethers} from "ethers"
    import {ref} from 'vue'
    import { webStore } from "../store"

    const store = webStore()
    const testNFT = store.testNFT

    const addressTo = ref(null)
    const tokenId = ref(null)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let TestNft = store.testNFT

    
    const currentCounter = ref(null)
    const totalSupply =  ref(null)

    const fetchStats = async() => {
      totalSupply.value = (await TestNft.maxSupply()).toString()
      currentCounter.value = (await TestNft.getCurrentCount()).toString()
    }
    fetchStats()


    const mintTo = async(addressTo) => {
        try {
            await TestNft.safeMint(addressTo)
            fetchStats()
        } catch (error) {
            console.log(error)
        }
    } 

    const getOwner = async(tokenId) => {
        try {
            const owner = await TestNft.ownerOf(tokenId)
            console.log(owner)
        } catch (error) {
            console.log(error)
        }
    } 
</script>
