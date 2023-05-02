import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { NftListed, NftSold } from "../generated/NFTMarketplace/NFTMarketplace"

export function createNftListedEvent(
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt,
  owner: Address
): NftListed {
  let nftListedEvent = changetype<NftListed>(newMockEvent())

  nftListedEvent.parameters = new Array()

  nftListedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  nftListedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return nftListedEvent
}

export function createNftSoldEvent(
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt,
  seller: Address,
  buyer: Address
): NftSold {
  let nftSoldEvent = changetype<NftSold>(newMockEvent())

  nftSoldEvent.parameters = new Array()

  nftSoldEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  nftSoldEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftSoldEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  nftSoldEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  nftSoldEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return nftSoldEvent
}
