<template>
  <div class="w-full flex flex-row">
    <form action="" class="w-1/6">
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
          @click="activity = 'sales'"
          class="
            w-full
            rounded-t-lg
            border-gray-200
            dark:border-gray-600
            cursor-pointer
          "
        >
          <div class="flex items-center pl-3 cursor-pointer">
            <span
              class="
                py-3
                ml-2
                w-full
                text-sm
                font-medium
                text-gray-900
                dark:text-gray-300
                border-b
              "
              :class="{ 'text-blue-600': activity == 'sales' }"
              >Sales</span
            >
          </div>
        </li>
        <li
          @click="activity = 'listings'"
          class="
            w-full
            rounded-t-lg
            border-gray-200
            dark:border-gray-600
            cursor-pointer
          "
        >
          <div class="flex items-center pl-3 cursor-pointer">
            <span
              class="
                py-3
                ml-2
                w-full
                text-sm
                font-medium
                text-gray-900
                dark:text-gray-300
              "
              :class="{ 'text-blue-600': activity == 'listings' }"
              >Listings</span
            >
          </div>
        </li>
      </ul>
    </form>

    <div class="w-d w-5/6">
      <div class="container mx-auto px-4 sm:px-8">
        <div class="py-2">
          <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
            <div
              class="
                inline-block
                min-w-full
                shadow-md
                rounded-lg
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
                  <tr class="hover:bg-gray-300 cursor-pointer" v-for="activity in allActivities" :key="activity.tokenId">
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
                            NFT Collection 1
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
import { ref, watch } from "vue";
import { ethers } from "ethers";
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import moment from 'moment';
moment().format();

const allActivities = ref([]) 

const activity = ref("listings");

const getRelativeTime = (timestamp) => {
  const parsedTime = moment.unix(timestamp);
  return parsedTime.fromNow()

}

const parsePrice = (price) => {
  return price / (10 ** 18) ? price / (10 ** 18) + 'E' : "------";
};


const { result, error } = useQuery(gql`
	query fetchAllActivities {
		nftListings(first : 100 ) {
			id
			nftAddress
			tokenId
			price
			owner
			blockTimestamp
		}
		nftSales(first : 100){
		    id
		    nftAddress
		    tokenId
		    price
		    buyer
		    seller
		    blockTimestamp
		}
    nftMinteds(first : 100) {
			id
			tokenId
			owner
			blockTimestamp
		}
    nftCancels(first : 100) {
			id
			tokenId
			owner
			blockTimestamp
		}
	}
	`)
	
	watch(result, value => {
		const all = value.nftListings.concat(value.nftSales, value.nftMinteds, value.nftCancels)
		allActivities.value = all.sort(function(x, y){
      return y.blockTimestamp - x.blockTimestamp;
    })
	})
</script>