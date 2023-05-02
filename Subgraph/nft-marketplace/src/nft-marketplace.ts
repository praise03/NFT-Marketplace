import {
  NftListed as NftListedEvent,
  NftSold as NftSoldEvent
} from "../generated/NFTMarketplace/NFTMarketplace"
import { NftListed, NftSold } from "../generated/schema"


export function handleNftListed(event: NftListedEvent): void {
  let entity = new NftListed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price
  entity.owner = event.params.owner

  entity.blockTimestamp = event.block.timestamp

  entity.save()
}

export function handleNftSold(event: NftSoldEvent): void {
  let entity = new NftSold(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price
  entity.seller = event.params.seller
  entity.buyer = event.params.buyer

  entity.blockTimestamp = event.block.timestamp

  entity.save()
}
