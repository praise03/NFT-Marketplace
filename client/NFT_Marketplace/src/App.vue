<template>
  <div>
    <notifications position="bottom right" />
    <nav
      class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900"
    >
      <div
        class="container flex flex-wrap justify-between items-center mx-auto"
      >
        <a href="#" class="p-2 flex items-center">
          <img src="/vite.svg" class="mr-3 h-6 sm:h-9" alt="Logo" />
          <span
          @click="router.push('/')"
            class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >BrokenSea</span
          >
        </a>
        <div class="flex md:order-2">
          <button
            @click="router.push('/account/' + currentAccount)"
            v-if="currentAccount !== null"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {{ currentAccount }}
          </button>
          <button
            v-else
            @click="connectWallet"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Connect
          </button>
        </div>
        <div
          class="justify-between items-center w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul
            class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li>
              <a
                @click="router.push('/mint')"
                href="#"
                class="block py-2 pr-2 pl-1 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
                >Mint</a
              >
            </li>
            <li>
              <a
                @click="router.push('/marketplace')"
                href="#"
                class="block py-2 pr-4 pl-1 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >Marketplace</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { webStore } from "./store";
import { utils } from "ethers";

const router = useRouter();
const store = webStore();
const currentAccount = ref(null);
const accountConnected = ref(null);
//sepolia
const targetNetworkId = "0xaa36a7";

const connectWallet = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install metamask to use full features");
      return;
    }
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts[0] + "connected");
    currentAccount.value = utils.getAddress(accounts[0]);
    store.currentAccount = currentAccount.value;
  } catch (error) {
    console.log(error);
  }
};

const checkIfAccountConnected = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install metamask to use full features");
      return;
    }

	if (!await checkNetwork()) {
		alert("You need to switch to the Sepolia Testnet");
		switchNetwork();
	}

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      currentAccount.value = utils.getAddress(accounts[0]);
      store.currentAccount = currentAccount.value;

      accountConnected.value = true;
    } else {
      accountConnected.value = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (currentChainId == targetNetworkId) return true;
    return false;
  }
};

const switchNetwork = async () => {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: targetNetworkId }],
  });
  window.location.reload();
};

if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (accounts) {
    checkIfAccountConnected();
  });
}

checkIfAccountConnected();
store.loadTestNFT();
store.loadNFTMarketplace();
</script>
