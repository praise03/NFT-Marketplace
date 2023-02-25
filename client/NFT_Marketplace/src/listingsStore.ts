import { defineStore } from "pinia";

interface Listing {
    owner: string;
    price: number;
    tokenId: string,
    timestamp: Date
}

interface State {
    listings : Listing[]
}

export const listingStore = defineStore({
    id: "listingStore",
    state: ():  State=> {
        return {
            listings: [] as Listing[],
        }
    },
    persist : true,
    actions : {
        addListing(listing : Listing) {
            this.listings.push(listing)
        },

        clearListings (){
            this.listings = []
        },

        cancelListing(tokenId: string) {
            for (let index = 0; index < this.listings.length; index++) {
                if (this.listings[index].tokenId == tokenId ) {
                    this.listings.splice(index, 1)
                }
            }
        }
    }
})