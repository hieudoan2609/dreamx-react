import * as Web3Utils from 'web3-utils'

import { matchBuyOrders, matchSellOrders } from './helpers'
import { generateOrders } from './testHelpers'

describe("matchBuyOrders", () => {
  describe("when there are no matched orders", () => {
    test.only("return the submitted order", () => {
      const buyBook = generateOrders([
        { type: 'buy', price: '0.9', amount: '1', date: "2019-06-19T20:25:59.459Z" },
        { type: 'buy', price: '0.8', amount: '1', date: "2019-06-19T20:25:59.459Z" },
        { type: 'buy', price: '0.7', amount: '1', date: "2019-06-19T20:25:59.459Z" },
        { type: 'buy', price: '0.6', amount: '1', date: "2019-06-19T20:25:59.459Z" },
        { type: 'buy', price: '0.5', amount: '1', date: "2019-06-19T20:25:59.459Z" }
      ])
      const order = generateOrders([
        { type: 'sell', price: '1', amount: '1', date: "2019-06-19T20:25:59.459Z" }
      ])[0]
      const expectedMatchResults = [ order ]
      const receivedMatchResults = matchBuyOrders({ order, buyBook })
      expect(receivedMatchResults).toEqual(expectedMatchResults)
    })
  })

  describe("when orderbook doesn't enough volume", () => {
    test("match all orders, return trades and the remaining order", () => {
      // const buyBook = [
      //   { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1'), type: 'buy' },
      //   { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.1'), type: 'buy' },
      //   { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.2'), type: 'buy' },
      //   { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.3'), type: 'buy' },
      //   { giveTokenAddress: baseAddress, giveAmount: Web3Utils.toWei('1'), takeTokenAddress: quoteAddress, takeAmount: Web3Utils.toWei('1.4'), type: 'buy' }
      // ]
      // const order = { giveTokenAddress: quoteAddress, giveAmount: Web3Utils.toWei('3.3'), takeTokenAddress: baseAddress, takeAmount: Web3Utils.toWei('3'), type: 'sell' }
      // const expectedMatchResults = [
      //   { giveTokenAddress: quoteAddress, giveAmount: Web3Utils.toWei('3.3'), takeTokenAddress: baseAddress, takeAmount: Web3Utils.toWei('1.2'), type: 'sell' }
      // ]
    });
  })

  describe("when orderbook has enough volume", () => {
    test("orders with higher prices should be matched first", () => {});

    test("if there are multiple orders of the same price, the older ones should be matched first", () => {})
  })
})
