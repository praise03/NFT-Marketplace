import { defineStore } from "pinia";

interface Sales {
    from: string;
    to: string;
    tokenId: number,
    price: number,
    timestamp: Date
}

interface State {
    sales : Sales[]
}

export const saleStore = defineStore({
    id: "saleStore",

    state: ():  State=> {
        return {
            sales: [],
        }
    },
    persist: true,
    actions: {
        recordSale(from:string, to:string, tokenId:number, price:number, timestamp:Date){
            const sale = {
                from: from,
                to: to,
                tokenId: tokenId,
                price: price,
                timestamp: timestamp
            }
            this.sales.push(sale)
        },
        clearSales() {
            this.sales = []
        }
    }

})