<template>
  <div class="flex flex-col md:flex-row p-1 sm:p-2 space-x-2">
    <div class="md:w-5/12">
		<h1 @click="router.push('/marketplace')" class="text-blue-600 text-lg font-bold mb-3 cursor-pointer">Gen Art</h1>
      <div class="border-2 bg-slate-800 rounded-t-lg">
        <div class="bg-white">
          <i class="fab fa-ethereum p-1"></i>
        </div>
        <img v-if="token.uri.image 	" :src="parseIpfs(token.uri.image)" class="" alt="" />
      </div>
	  <div>
		  <h2>Description: </h2>
		  <h4>{{ token.uri.attributes }}</h4>
	  </div>
    </div>

    <div class="md:w-6/12">
      <br><br>
	  <div class="flex float-right align-top ">
	  
	  <div v-if="isOwner()" class="p-1 mb-4">
	  <input type="text" class="w-24 h-12 p-1 mt-2 mr-1" v-model="listingPrice" placeholder="amount" required> 
	 <button v-if="token.price != ''"
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
      <h2 class="font-bold text-2xl">{{token.uri.name}}</h2>
      <span v-if="isOwner()" class="flex font-thin text-xs">Owned by You</span>
	  <span v-else class="flex font-thin text-xs"
        >Owned By
        <p class="text-blue-600 ml-1 text-md">{{token.owner.substring(0,6)}}....</p>
      </span>

      <div v-if="token.price != null & token.price != undefined & token.price.length != 0" class="p-6 border rounded-md mt-8">
        <p class="font-thin text-sm">Current Price</p>
        <h2 class="text-3xl font-bold mt-1">
          {{token.price}} ETH <span class="font-thin text-xs">${{token.price * 1204}}</span>
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
import { watch, ref, computed, reactive } from "vue";
import { webStore } from "../store"
import { useNotification } from "@kyvg/vue3-notification";

const { notify}  = useNotification()

const route = useRoute();
const router = useRouter();
const store = webStore();

const testNFT = store.testNFT
const NFTMarketplace = store.NFTMarketplace

interface Token {
	owner: string,
	price: string,
	uri: Object
}

const token : Token = reactive({
	owner: '',
	price: '',
	uri: ''
})

const listingPrice = ref('')

const fetchToken = async() => {
	if(!route.params.id){return}
	const tokenId = route.params.id;
	const tokenURI = await getTokenUri(tokenId);
	const response = await NFTMarketplace.getListing(testNFT.address, tokenId)
	if (response.owner !== '0x0000000000000000000000000000000000000000') {
		token.owner = response.owner,
		token.price = ethers.utils.formatEther(response.price),
		token.uri = tokenURI
	}else {
		token.owner = await testNFT.ownerOf(tokenId);
		token.price = '',
		token.uri = tokenURI
	}
}
fetchToken()

const parseIpfs = (ipfsHash) => {
	const URL = "https://gateway.pinata.cloud/ipfs/"
	const hash = ipfsHash.replace(/^ipfs?:\/\//, '')
	const ipfsURL = URL + hash

	return ipfsURL
} 



async function getTokenUri(tokenId){
	const ipfsHash = await testNFT.tokenURI(tokenId)
	const pinataUrl = parseIpfs(ipfsHash)
	const response = await fetch(pinataUrl);

	if(!response.ok)
	throw new Error(response.statusText);

	const tokenUri = await response.json();
	return tokenUri
} 

const isOwner = () => {
	return Number(token.owner) == Number(store.currentAccount)
}


const setApproval = async() => {
	const Txreceipt = await testNFT.setApprovalForAll(NFTMarketplace.address, true)
	await Txreceipt.wait(1)
	notify({
		title: "Approval Set Successfully"
	});
}

const ListItem =  async () => {
	if (route.params.id !==  null && listingPrice.value !== '') { 
		try {
			const approved = await testNFT.isApprovedForAll(store.currentAccount, NFTMarketplace.address)
			const tokenId = route.params.id
			if (approved) {
				const response = await NFTMarketplace.listNFT(testNFT.address, tokenId, ethers.utils.parseUnits(String(listingPrice.value),"ether"))
				await response.wait(1)
				await fetchToken()
				listingPrice.value = ''
				notify({
					title: "Item Listed Successfully"
				});
			} else {
				await setApproval()
				ListItem() 
			}
		} catch (error) {
			console.log(error) 
			notify({
				title: "Something Went Wrong"
			});  
		}
	}else {notify({
			title: "Invalid Parameters"
		});}

}

const lowerPrice = async () => {
	const tokenId = route.params.id
	await fetchToken()
	if( token.price.length == 0 || listingPrice.value == 0){
		return
	}
	if (Number(listingPrice.value) >= Number(token.price) ) {
		notify({
			title: "New Price Must Be Less Than Old Price"
		});
		return;
	}
	try {
		const response = await NFTMarketplace.lowerPrice(testNFT.address, tokenId, ethers.utils.parseUnits(String(listingPrice.value),"ether"))
		await response.wait(1)
		await fetchToken()
		listingPrice.value = ''
	}
	catch(error) { console.log(error);  }
}

const buyItem = async () => {
	try {
		const price = ethers.utils.parseUnits(token.price,"ether")
		if (!price) {return}
		const txResponse = await NFTMarketplace.buyNFT(testNFT.address, route.params.id, { value: price })
		await txResponse.wait(1)
		await fetchToken()
		notify({
			title: "Item Bought Successfully"
		});
	} catch (error) {
		console.log(error)
	}
}

const cancelListing= async () => {
	try {
		const txResponse = await NFTMarketplace.cancelListing(testNFT.address, route.params.id)
		await txResponse.wait(1)
		await fetchToken()
		notify({
			title: "Listing Cancelled Successfully"
		});
	} catch (error) {
		console.log(error)
	}
}

watch(
  () => route.params.id,
  async () => {
	  fetchToken()
  },
);

</script>
