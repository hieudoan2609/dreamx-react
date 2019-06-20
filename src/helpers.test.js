import * as Web3Utils from 'web3-utils'

import { matchBuyOrders, matchSellOrders } from './helpers'
import { generateOrders, generateTrades } from './testHelpers'

describe("matchBuyOrders", () => {
  describe("when there are no matched orders", () => {
    test("return the submitted order", () => {
      const buyBook = generateOrders([
        { type: 'buy', price: '0.9', amount: '1', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
        { type: 'buy', price: '0.8', amount: '1', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#1" },
        { type: 'buy', price: '0.7', amount: '1', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#2" },
        { type: 'buy', price: '0.6', amount: '1', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#3" },
        { type: 'buy', price: '0.5', amount: '1', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#4" }
      ])
      const order = generateOrders([
        { type: 'sell', price: '1', amount: '1' }
      ])[0]
      const expectedMatchResults = { trades: [], orders: [order] }
      const receivedMatchResults = matchBuyOrders({ order, buyBook })
      expect(receivedMatchResults).toEqual(expectedMatchResults)
    })
  })

  describe("when orderbook doesn't enough volume", () => {
    test.only("match all orders, return trades and a rest order", () => {
      const buyBook = generateOrders([
        { type: 'buy', price: '0.9', amount: '1', filled: '0', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
        { type: 'buy', price: '0.8', amount: '1', filled: '0', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#1" },
        { type: 'buy', price: '0.7', amount: '1', filled: '0', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#2" },
        { type: 'buy', price: '0.6', amount: '1', filled: '0', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#3" },
        { type: 'buy', price: '0.5', amount: '1', filled: '0', date: "2019-06-19T20:25:59.459Z", orderHash: "BUY#4" }
      ])
      const order = generateOrders([
        { type: 'sell', price: '0.8', amount: '3' }
      ])[0]
      const expectedTrades = generateTrades([
        { orderHash: 'BUY#0', amount: '0.9' },
        { orderHash: 'BUY#1', amount: '0.8' }
      ])
      const expectedOrders = generateOrders([
        { type: 'sell', price: '0.8', amount: '1' }
      ])
      const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
      const receivedMatchResults = matchBuyOrders({ order, buyBook })
      console.log(receivedMatchResults)
      // expect(receivedMatchResults).toEqual(expectedMatchResults)
    });

    test("match a partially filled order, return a trade and a rest order")
  })

  describe("when orderbook has enough volume", () => {
    test("orders with higher prices should be matched first", () => {});

    test("if there are multiple orders of the same price, the older ones should be matched first", () => {})
  })
})
