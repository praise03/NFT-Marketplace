<template>
<div>
  <div>
    <div class="relative">
        <img src="/banner.png" class="w-full h-80" alt="" />
        <img src="/img.png" class="image  top-auto" alt="" />
    </div>

    <div class="p-6 space-y-3">
        <h1 class="text-2xl font-bold">{{store.currentAccount}}</h1>
    </div>

    <div class=" w-full border-b mb-4 flex  flex-row space-x-10">

        <div @click="currentTab = 'Collected'" :class="{underline : currentTab == 'Collected'}" class="cursor-pointer ml-6 mb-2">
            <h1>Collected</h1>
        </div>
        <div @click="currentTab = 'Activity'" :class="{underline : currentTab == 'Activity'}" class="ml-6 cursor-pointer">
            <h1>Activity</h1>
        </div>
    </div>
  </div>

  <div v-if="currentTab == 'Collected'">
        <div class="flex flex-wrap md:w-3/4 p-2 ml-4">
            <!-- <button @click="showListings()">Show Listings</button> -->
            <div
            v-for="token in userTokens"
            :key="token.id"
            class="flex items-center justify-center cursor-pointer"
            >
            <div
                @click="router.push('/token/' + token.id)"
                class="md:w-64 bg-gray-800 mb-4 mr-4 rounded-md shadow-xl"
            >
                <img
                src="/img.png"
                class="hover:scale-75 ease-in duration-500"
                alt="BAYC Ape"
                />
                <div class="bg-white text-black p-2 rounded-md">
                <h2 class="text-md font-semibold mt-3">#{{ token.id }}</h2>
                <div class="flex justify-between items-center text-sm mt-2">
                    <p class="font-semibold text-lg" v-if="getTokenPrice(token.id) != null">
                    <i class=" fab fa-ethereum"></i> {{ getTokenPrice(token.id) }}
                    <span class="font-thin text-xs">ETH</span>
                    </p>
                    <p class="font-semibold text-lg" v-else>
                    
                    <span class="font-thin text-xs">No active listing</span>
                    </p>

                    <!-- <button @click="buyItem(token.id)" class="px-4 rounded-md float-right py-1 bg-black text-white">Buy</button> -->
                </div>
                </div>
            </div>
            </div>
        </div>
  </div>


  <div v-if="currentTab == 'Activity'" class="w-d w-full">
      <div class="">
        <div class="py-2">
          <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
            <div
              class="
                inline-block
                min-w-full
                shadow-md
                rounded-sm
                overflow-hidden
              "
            >
              <table class="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-700
                        uppercase
                        tracking-wider
                      "
                    ></th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-700
                        uppercase
                        tracking-wider
                      "
                    >
                      Item
                    </th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-700
                        uppercase
                        tracking-wider
                      "
                    >
                      Price
                    </th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-700
                        uppercase
                        tracking-wider
                      "
                    >
                      From
                    </th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-700
                        uppercase
                        tracking-wider
                      "
                    >
                      To
                    </th>
                    <th
                      class="
                        px-5
                        py-3
                        border-b-2 border-gray-200
                        bg-gray-100
                        text-left text-xs
                        font-semibold
                        text-gray-700
                        uppercase
                        tracking-wider
                      "
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  
                  <tr class="hover:bg-gray-300 cursor-pointer" v-for="activity in userActivity" :key="activity.tokenId">
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">{{ String(activity.__typename).slice(3) }}</p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        text-sm
                      "
                    >
                      <div class="flex">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img
                            class="w-full h-full rounded-full"
                            src="/img.png"
                            alt=""
                          />
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-900 whitespace-no-wrap">
                            Gen Art
                          </p>
                          <p class="text-gray-600 whitespace-no-wrap">
                            #{{ activity.tokenId }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ parsePrice(activity.price) }}
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ activity.owner ? activity.owner.substring(0,6) : activity.seller.substring(0, 6) }}...
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">{{activity.buyer ? activity.buyer.substring(0,6) : '------ '}}</p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getRelativeTime(activity.blockTimestamp) }}...
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from "vue";
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import moment from 'moment';
import { webStore } from "../store";
import { ethers } from "ethers";
import { useRoute, useRouter } from "vue-router";
moment().format();

const currentTab = ref("Collected")
const userActivity = ref([]); 
const userTokens = ref([]);

const route = useRoute();

const store = webStore()
const testNFT = store.testNFT
const account = route.params.account

const getRelativeTime = (timestamp) => {
  const parsedTime = moment.unix(timestamp);
  return parsedTime.fromNow()

}

const parsePrice = (price) => {
  return price / (10 ** 18) ? price / (10 ** 18) + 'E' : "------";
};

const getActivity = async() => {
  const userActivities = ref([])
	const { result, error } = useQuery(gql`
	query NftListed($account: String) {
		nftListings(where : { owner: $account } ) {
			id
			nftAddress
			tokenId
			price
			owner
			blockTimestamp
		}
		nftSales(where: { or: [{ buyer: $account }, { seller: $account }] }){
		    id
		    nftAddress
		    tokenId
		    price
		    buyer
		    seller
		    blockTimestamp
		}
    nftMinteds(where : { owner: $account } ) {
			id
			tokenId
			owner
			blockTimestamp
		}
    nftCancels(where : { owner: $account } ) {
			id
			tokenId
			owner
			blockTimestamp
		}
	}
	`, { account: account })
	
	watch(result, value => {
		userActivities.value = value.nftListings.concat(value.nftSales, value.nftMinteds, value.nftCancels)
		userActivity.value= userActivities.value.sort(function(x, y){
								return y.blockTimestamp - x.blockTimestamp;
							})
		console.log(userActivity.value)
	})
}
getActivity()

const fetchUserTokens = async() => {
    // const tokenCount = await testNFT._tokenCounter()
    let loop = false;
    let num = 1;
    while (loop) {
        try {
        //Fetch tokens
        const response = await testNFT.ownerOf(num);
        console.log(response)
        if (response == store.currentAccount) {
            const Item = {
                id: num,
                owner: response,
            };  
            userTokens.value.push(Item);  
        }
        ++num;
        } catch (error) {
        console.log("No more tokens");
        loop = false;
        }
    }
}
fetchUserTokens();

const getTokenPrice = (tokenId:string) => {
  const { result } = useQuery(gql`
      query nftTokenPrice($tokenId: String ) {
        nftListings(where : { tokenId: $tokenId } ) {
            price
        }
      }
    `, { tokenId: tokenId })
    console.log(result)
    watch(result, value => {
      return value.nftListings[0].price / (10 ** 18)
    })
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