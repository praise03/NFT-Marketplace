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
                  <tr
                    v-show="activity == 'sales'"
                    v-for="sale in sales"
                    :key="sale.tokenId"
                  >
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p
                        class="text-gray-900 whitespace-no-wrap font-extralight"
                      >
                        Transfer <span class="fas fa-exchange"></span>
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <div class="flex">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img
                            class="w-full h-full rounded-full"
                            src="img.png"
                            alt=""
                          />
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-900 whitespace-no-wrap">
                            NFT Collection 1
                          </p>
                          <p class="text-gray-600 whitespace-no-wrap">
                            #{{ sale.tokenId }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ parsePrice(sale.price) }}E
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ sale.from.substring(0, 6) }}...
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ sale.to.substring(0, 6) }}...
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getRelativeTime(sale.timestamp) }}...
                      </p>
                    </td>
                  </tr>
                  <tr
                    v-show="activity == 'listings'"
                    v-for="listing in listings"
                    :key="listing.tokenId"
                  >
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">Listing</p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <div class="flex">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img
                            class="w-full h-full rounded-full"
                            src="img.png"
                            alt=""
                          />
                        </div>
                        <div class="ml-3">
                          <p class="text-gray-900 whitespace-no-wrap">
                            NFT Collection 1
                          </p>
                          <p class="text-gray-600 whitespace-no-wrap">
                            #{{ listing.tokenId }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ parsePrice(listing.price) }}E
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ listing.owner.substring(0, 6) }}...
                      </p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">------</p>
                    </td>
                    <td
                      class="
                        px-5
                        py-5
                        border-b border-gray-200
                        bg-white
                        text-sm
                      "
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ getRelativeTime(listing.timestamp) }}...
                      </p>
                    </td>
                  </tr>
                  <!-- </span> -->
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
import { ref } from "vue";
import { ethers } from "ethers";
import { saleStore } from "../saleStore";
import { listingStore } from "../listingsStore";

//relative time format
import * as dayjs from "dayjs";
dayjs().format();
import * as relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const listings = listingStore().listings;
console.log(listings);
const sales = saleStore().sales;

const activity = ref("listings");

const getRelativeTime = (time) => {
  return dayjs(time).fromNow();
};

const parsePrice = (price) => {
  return ethers.utils.formatEther(price);
};
</script>