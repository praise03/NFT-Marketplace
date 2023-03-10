<template>
  <div class="flex flex-col md:flex-row p-1 sm:p-2 space-x-2">
    <div class="md:w-5/12">
		<h1 @click="router.push('/marketplace')" class="text-blue-600 text-lg font-bold mb-3 cursor-pointer">NFT Collection 1</h1>
      <div class="border-2 bg-slate-800 rounded-t-lg">
        <div class="bg-white">
          <i class="fab fa-ethereum p-1"></i>
        </div>
        <img src="/img.png" class="" alt="" />
      </div>
    </div>

    <div class="md:w-6/12">
      <br><br>
	  <div class="flex float-right align-top ">
	  
	  <div v-if="isOwner()" class="p-1 mb-4">
	  <input type="text" class="w-24 h-12 p-1 mt-2 mr-1" v-model="price" placeholder="amount" required> 
	 <button v-if="isItemListed()"
          class="mt-2 px-12 py-3 text-white bg-blue-600 text-md rounded-md hover:bg-blue-400 mr-1"
		  @click="lowerPrice()"

        >
          Lower Price
        </button>	 
	  <button v-else
          class="mt-2 px-10 py-3 text-white bg-blue-600 text-md rounded-md hover:bg-blue-400 mr-1"
		  @click="ListItem()"

        >
          List Item
        </button>
		
		<button
          class="mt-2 px-10 py-3 text-white bg-blue-600 text-md rounded-md hover:bg-blue-400 float-right"
		  @click="cancelListing()"

        >
          Cancel
        </button>
		</div>
	  </div>
      <h2 class="font-bold text-2xl">NFT Token #{{route.params.id}}</h2>
      <span v-if="isOwner()" class="flex font-thin text-xs">Owned by You</span>
	  <span v-else class="flex font-thin text-xs"
        >Owned By
        <p class="text-blue-600 ml-1 text-md">{{owner.substring(0,6)}}....</p>
      </span>

      <div v-if="parsedCurrentPrice != null || parsedCurrentPrice != undefined" class="p-6 border rounded-md mt-8">
        <p class="font-thin text-sm">Current Price</p>
        <h2 class="text-3xl font-bold mt-1">
          {{parsedCurrentPrice}} ETH <span class="font-thin text-xs">${{parsedCurrentPrice * 1204}}</span>
        </h2>

        <button
          class="mt-2 px-16 py-3 text-white bg-blue-600 text-md rounded-md hover:bg-blue-400"
		  v-if="!isOwner()"
		  @click="buyItem()"
        >
          Buy Now
        </button>
      </div>
	  <div class="p-6 border rounded-md mr-1 mt-8" v-else>
		  <p>No active Listings</p>
	  </div>
    </div>	
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ethers } from "ethers";
import { watch, ref, computed } from "vue";
import { webStore } from "../store"
import { listingStore } from "../listingsStore"
import { saleStore } from "../saleStore"


const Listings = listingStore()
const listings = Listings.listings
const sales = saleStore()
const route = useRoute();
const router = useRouter();
const store = webStore();

// Listings.clearListings()
// sales.clearSales()


const testNFT = store.testNFT
const NFTMarketplace = store.NFTMarketplace

let owner = ref('')
let price = ref(null)
let newPrice = ref(null)
let currentPrice = ref(null)
let recalculate = ref(0)

const parsedCurrentPrice = computed(() => {
	recalculate.value
	if (currentPrice.value) {
		return ethers.utils.formatEther(currentPrice.value)	
	}
})


const fetchOwner = async () => {
	owner.value = await testNFT.ownerOf(route.params.id)
}
fetchOwner()

const getPrice = () => {
	if(!route.params.id){return}
	if(listings.length != 0) {
		for (let index = 0; index < listings.length; index++) {
			if (listings[index].tokenId == route.params.id ) {
				currentPrice.value = listings[index].price
				// console.log(currentPrice.value)
				recalculate.value++
				return currentPrice.value
				
			}else {currentPrice.value = null}
		}
	}else{ currentPrice.value = null}
	
}
getPrice()

// const showListings = async() => {
// 	console.log(listings)
// }


const isOwner = () => {
	return Number(owner.value) == Number(store.currentAccount)
}


const isItemListed = () => {
	const tokenId = route.params.id
	if (getPrice() != undefined) {
		return true
	}else {return false}
}

const setApproval = async() => {
	const Txreceipt = await testNFT.setApprovalForAll(NFTMarketplace.address, true)
	await Txreceipt.wait(1)
}

const ListItem =  async () => {
	if (route.params.id !==  null && price.value !== 0) {
		try {
			const approved = await testNFT.isApprovedForAll(store.currentAccount, NFTMarketplace.address)
			const tokenId = route.params.id
			if (approved) {
				const response = await NFTMarketplace.listNFT(testNFT.address, tokenId, ethers.utils.parseUnits(price.value,"ether"))
				await response.wait(1)
				const listing = await NFTMarketplace.getListing(testNFT.address, tokenId)
				const owner = listing.owner
				const amount = listing.price

				const newListing = {
					owner : owner,
					price : amount,
					tokenId : tokenId,
					timestamp: new Date()
				}

				Listings.addListing(newListing)
				// console.log(listings)
				price.value = ""
				getPrice()
				
			} else {
				await setApproval()
				ListItem() 
			}
		
		} catch (error) {
			console.log(error)   
		}
	}

}

const lowerPrice = async () => {
	const tokenId = route.params.id
	const listing = await NFTMarketplace.getListing(testNFT.address, tokenId)
	console.log(listing)
	if( Number(ethers.utils.formatEther(listing.price)) == 0){
		return
	}
	if (Number(price.value) > Number(ethers.utils.formatEther(listing.price)) || Number(price.value) == Number(ethers.utils.formatEther(listing.price)) ) {
		alert("New price must be lesser than old price");
		return;
	}
	try {
		const response = await NFTMarketplace.lowerPrice(testNFT.address, tokenId, ethers.utils.parseUnits(price.value,"ether"))
		await response.wait(1)
		
		for (let index = 0; index < listings.length; index++) {
			if (listings[index].tokenId == route.params.id ) {
				currentPrice.value = listings[index].price
				listings[index].price = ethers.utils.parseUnits(price.value,"ether")
				listings[index].timestamp = new Date()
			}
		}
		const listing = await NFTMarketplace.getListing(testNFT.address, tokenId)
		console.log(listing)
		price.value = ""
		getPrice()
	}
	catch(error) { console.log(error);  }
}

const buyItem = async () => {
	try {
		const price = currentPrice.value
		const txResponse = await NFTMarketplace.buyNFT(testNFT.address, route.params.id, { value: price })
		await txResponse.wait(1)
		// console.log("new owner: ",await testNFT.ownerOf(route.params.id))
		Listings.cancelListing(route.params.id)
		sales.recordSale(owner.value, String(store.currentAccount), Number(route.params.id), price, new Date())
		fetchOwner()
		getPrice()
		console.log("here ",  parsedCurrentPrice.value)
	} catch (error) {
		console.log(error)
	}
}

const cancelListing= async () => {
	try {
		const txResponse = await NFTMarketplace.cancelListing(testNFT.address, route.params.id)
		await txResponse.wait(1)
		Listings.cancelListing(route.params.id)
		console.log("Listing cancelled")
	} catch (error) {
		console.log(error)
	}
}

watch(
  () => route.params.id,
  async () => {
	  fetchOwner()
  },
);

</script>
