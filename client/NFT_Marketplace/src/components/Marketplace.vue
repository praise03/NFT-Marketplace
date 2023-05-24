<template>
<div>
  <div>
    <div class="relative">
        <img src="/CryptopunksBg.png" class="w-full h-80" alt="" />
        <img src="/img.png" class="image  top-auto" alt="" />
        </div>

        <div class="p-6 space-y-3">
        <h1 class="text-2xl font-bold">Gen Art</h1>
        <h3>By <span class="font-bold mt-1"> Praise</span></h3>
        <ul class="flex space-x-8">
            <li>
            Items <b>{{ no_of_tokens }}</b>
            </li>
            <li>Created <b>Dec 2022</b></li>
            <li>Chain <b>Ethereum</b></li>
        </ul>
        <h3>A dynamic NFT collection on the Ethereum Blockchain</h3>
        </div>

        <div class="flex space-x-10 p-6 -mt-4 font-light">
        <span>
            <b class="text-xl font-bold">{{Volume}} ETH</b> <br />
            <p>Volume</p>
        </span>
        <span>
            <b class="text-xl font-bold">{{ floorPrice }} ETH</b> <br />
            <p>Floor Price</p>
        </span>
        <span>
            <b class="text-xl font-bold">{{ no_of_owners }}</b> <br />
            <p>Owners</p>
        </span>
        </div>

        <div class=" w-full border-b mb-4 flex  flex-row space-x-10">

            <div @click="currentTab = 'items'" :class="{underline : currentTab == 'items'}" class="cursor-pointer ml-6 mb-2">
                <h1>Items</h1>
            </div>
            <div @click="currentTab = 'activity'" :class="{underline : currentTab == 'activity'}" class="ml-6 cursor-pointer">
                <h1>Activity</h1>
            </div>
        </div>

        <Transition name="slide-fade">
        <div v-if="currentTab == 'items' " class="flex flex-row">
        <div class="text-lg font-medium md:w-1/4 p-2 space-y-6">
            <ul
            class="
                text-sm
                w-full
                p-1
                font-medium
                text-gray-900
                bg-white
                rounded-lg
                border border-gray-200
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
            "
            >
            <li
                class="
                w-full
                rounded-t-lg
                border-b border-gray-200
                dark:border-gray-600
                "
            >
                <div class="flex items-center md:pl-3">
                <label
                    for="vue-checkbox"
                    class="
                    py-3
                    md:ml-2
                    w-full
                    text-xs
                    md:text-sm
                    font-medium
                    text-gray-900
                    dark:text-gray-300
                    "
                    >Buy Now</label
                >
                <input
                    type="checkbox"
                    value=""
                    class="
                    w-4
                    h-4
                    text-blue-600
                    bg-gray-100
                    rounded
                    border-gray-300
                    focus:ring-blue-500
                    dark:focus:ring-blue-600 dark:ring-offset-gray-700
                    focus:ring-2
                    dark:bg-gray-600 dark:border-gray-500
                    "
                />
                </div>
            </li>
            <li
                class="
                w-full
                rounded-t-lg
                border-b border-gray-200
                dark:border-gray-600
                "
            >
                <div class="flex items-center md:pl-3">
                <label
                    for="react-checkbox"
                    class="
                    py-3
                    md:ml-2
                    w-full
                    text-xs
                    md:text-sm
                    font-medium
                    text-gray-900
                    dark:text-gray-300
                    "
                    >Show All</label
                >
                <input
                    type="checkbox"
                    class="
                    w-4
                    h-4
                    text-blue-600
                    bg-gray-100
                    rounded
                    border-gray-300
                    focus:ring-blue-500
                    dark:focus:ring-blue-600 dark:ring-offset-gray-700
                    focus:ring-2
                    dark:bg-gray-600 dark:border-gray-500
                    "
                />
                </div>
            </li>
            </ul>
        </div>
        <div class="flex flex-wrap md:w-3/4 p-2 ml-4">
            <!-- <button @click="showListings()">Show Listings</button> -->
            <div
            v-for="token in tokens"
            :key="token.id"
            class="flex items-center justify-center cursor-pointer"
            >
            <div
                @click="router.push('/token/' + token.id)"
                class="md:w-64 bg-gray-800 mb-4 mr-4 rounded-md shadow-xl"
            >
                <img
                :src="token.image"
                class="hover:scale-75 ease-in duration-500 rounded-md"
                alt="BAYC Ape"
                />
                <div class="bg-white text-black p-2">
                <h2 class="text-md font-semibold mt-1">Art Piece #{{ token.id }}</h2>
                </div>
                
                <button class=" px-4 w-full rounded-b-sm py-1 bg-blue-600 text-white">{{token.price}}</button>
            </div>
            </div>
        </div>
        </div>
        </Transition>
  </div>

    <Transition name="slide-fade">
        <Activity v-if="currentTab == 'activity'" />
    </Transition>

</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ethers } from "ethers";
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRouter, useRoute } from "vue-router";
import { webStore } from "../store";
import Activity from './Activity.vue'
import { storeToRefs } from "pinia";
import { parse } from "graphql";



const router = useRouter();
const store = webStore();
const tokens = ref([]);
const price = ref(0);
const no_of_tokens = ref(0);

store.isConnectedToSepolia();

const currentTab = ref("items")

const floorPrice = ref(0);
const no_of_owners = ref(0);
const Volume = ref(0)

const testNFT = store.testNFT;
const nftMarketplace = store.NFTMarketplace;

const getFloorPrice = async () => {

  //get floor price
  const { result } = useQuery(gql`
      query getFloorPrice {
        nftListings(orderBy: price, orderDirection: asc, first:1) {
          price
        }
      }
    `)
    
    watch(result, value => {
      floorPrice.value = Number(ethers.utils.formatEther(value.nftListings[0]['price']))
	  console.log(value.nftListings[0]['price'])
    })


};
getFloorPrice()

const getVolume = async() => {
	//get total number of sales
	const { result } = useQuery(gql`
      query getVolume {
        nftSales(first:100) {
          price
        }
      }
    `)
    
    watch(result, value => {
		let priceArray = []
		for (let i = 0; i < value.nftSales.length; i++) {
			priceArray.push(value.nftSales[i]['price'])
		}
		Volume.value = (priceArray.reduce((a, b) => a + b) / 10 ** 18)
    })
}
getVolume()

const fetchNFTTokens = async () => {
  let ownerArray = [];
  
  //get token count 
  no_of_tokens.value = await testNFT.tokenCount();
  
  const tokenCount = Number((no_of_tokens.value).toString());
  for (let index = 1; index <= tokenCount; index++) {
	  try {
		const owner = await testNFT.ownerOf(index);
		
		const Item = {
			id: index,
			owner: owner,
			price: await getTokenPrice(index),
			image: await getTokenImage(index)
		};
		tokens.value.push(Item);

		//get number of unique owners
		ownerArray.push(owner);
		no_of_owners.value = new Set(ownerArray).size;
	  }catch (error) {
		console.log("No more tokens");
	}
	  
  }
  
};

fetchNFTTokens();

const getTokenPrice = async(tokenId: number) => {
	//get price if listed
	const response = (await nftMarketplace.getListing(testNFT.address, tokenId))['price']
	return response == 0 ? 'No active listing' : 'Buy Now: ' + ethers.utils.formatEther(response) + ' ETH'
};

const parseIpfs = (ipfsHash) => {
	const URL = "https://gateway.pinata.cloud/ipfs/"
	const hash = ipfsHash.replace(/^ipfs?:\/\//, '')
	const ipfsURL = URL + hash

	return ipfsURL
} 



async function getTokenImage(tokenId){
	const ipfsHash = await testNFT.tokenURI(tokenId)
	const pinataUrl = parseIpfs(ipfsHash)
	const response = await fetch(pinataUrl);

	if(!response.ok)
	throw new Error(response.statusText);

	const tokenUri = await response.json();
	const tokenImage = parseIpfs(tokenUri.image) 
	return tokenImage
} 


</script>

<style>
.image {
  position: absolute;
  inset: 0px;
  box-sizing: border-box;
  padding: 0px;
  border: none;
  margin: auto;
  display: block;
  width: 150px;
  height: 180px;
  right: auto;
  border: black solid 4px;
  object-fit: cover;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translatey(20px);
  opacity: 0;
}

/* .bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
} */
</style>