import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Error from "./components/Error.vue";
import TestNft from "./components/TestNft.vue"
import NFTMarketplace from "./components/Marketplace.vue"
import Token from "./components/Token.vue"
import Account from "./components/Account.vue"

const routes = [
    {
        path: '/pathMatch(.*)*',
        name: 'Error',
        component: Error
    },
    {
        path: "/",
        name: 'Home',
        component: Home
    },
    {
        path: "/mint",
        name: "Mint",
        component: TestNft
    },
    {
        path: "/marketplace",
        name: "Marketplace",
        component: NFTMarketplace
    },
    {
        path: "/token/:id",
        name: "Token",
        component: Token
    },
    {
        path: "/account/:account",
        name: "Account",
        component: Account
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router