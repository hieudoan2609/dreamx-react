import { matchBuyOrders, matchSellOrders } from './helpers'
import * as Web3Utils from 'web3-utils'

const baseAddress = "0x0000000000000000000000000000000000000000"
const quoteAddress = "0xe62cc4212610289d7374f72c2390a40e78583350"

describe("matchBuyOrders", () => {
  describe("when there are no matched orders", () => {
    test.only("return the submitted order", () => {
      const buyBook = [
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.1'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.2'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.3'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.4'), type: 'buy' }
      ]
      const order = { giveTokenAddress: quoteAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: baseAddress, takeAmount: Web3Utils.toWei('1.1'), type: 'sell' }
      const expectedMatchResults = [ order ]
      const receivedMatchResults = matchBuyOrders({ order, buyBook })
      expect(receivedMatchResults).toEqual(expectedMatchResults)
    })
  })

  describe("when orderbook doesn't enough volume", () => {
    test("match all orders, return trades and the remaining order", () => {
      const buyBook = [
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.1'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.2'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.3'), type: 'buy' },
        { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.4'), type: 'buy' }
      ]
      const order = { giveTokenAddress: quoteAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: baseAddress, takeAmount: Web3Utils.toWei('1.1'), type: 'sell' }
    });
  })

  describe("when orderbook has enough volume", () => {
    test("orders with higher prices should be matched first", () => {});

    test("if there are multiple orders of the same price, the older ones should be matched first", () => {})
  })
})
