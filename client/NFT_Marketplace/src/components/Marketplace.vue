<template>
<div>
  <div>
    <div class="relative">
        <img src="banner.png" class="w-full h-80" alt="" />
        <img src="img.png" class="image  top-auto" alt="" />
        </div>

        <div class="p-6 space-y-3">
        <h1 class="text-2xl font-bold">NFT Collection 1</h1>
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
                src="img.png"
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
        </Transition>
  </div>

    <Transition name="slide-fade">
        <Activity v-if="currentTab == 'activity'" />
    </Transition>

</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from "vue";
import { ethers } from "ethers";
import { useRouter, useRoute } from "vue-router";
import { webStore } from "../store";
import { listingStore } from "../listingsStore";
import { saleStore } from "../saleStore";
import Activity from './Activity.vue'
import { storeToRefs } from "pinia";

//relative time format
import * as dayjs from "dayjs";
dayjs().format();
import * as relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const router = useRouter();
const store = webStore();
const Listings = listingStore();
const listings = Listings.listings;
const sales = saleStore().sales;
const tokens = ref([]);
const price = ref(0);
const no_of_tokens = ref(0);

const currentTab = ref("items")

const floorPrice = ref(0);
const no_of_owners = ref(0);
const Volume = ref(0)

const testNFT = store.testNFT;
console.log("Curr account: ", store.currentAccount);

const fetchNFTTokens = async () => {
  let loop = true;
  let num = 1;
  let ownerArray = [];
  while (loop) {
    try {
      //Fetch tokens
      const response = await testNFT.ownerOf(num);
      console.log(response);
      const Item = {
        id: num,
        owner: response,
      };
      tokens.value.push(Item);
      console.log('here')

      //Get number of owners
      ownerArray.push(response);

      ++num;
    } catch (error) {
      console.log("No more tokens");
      loop = false;
    }
  }
  no_of_tokens.value = num - 1;
  no_of_owners.value = new Set(ownerArray).size;
};

fetchNFTTokens();

const getStats = async () => {
  if (listings.length != 0) {
    let fP = 0;
    for (let index = 0; index < listings.length; index++) {
      let price = Number(ethers.utils.formatEther(listings[index].price));
      if (fP > price || fP == 0) {
        fP = price;
      }
    }
    floorPrice.value = fP;
  }
  if (sales.length != 0) {
      let volume = 0
      for (let index = 0; index < sales.length; index++) {
          volume = volume + Number(ethers.utils.formatEther(sales[index].price))
      }
      Volume.value = Number(volume.toFixed(2))
  }
};
getStats();

const getTokenPrice = (tokenId) => {
  for (let index = 0; index < listings.length; index++) {
    if (listings[index].tokenId == tokenId) {
      return ethers.utils.formatEther(listings[index].price) ? ethers.utils.formatEther(listings[index].price) : null ;
    }
  }
};



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