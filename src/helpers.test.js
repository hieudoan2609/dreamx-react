import * as Web3Utils from 'web3-utils'

import { matchBuyOrders, matchSellOrders, generateTestOrders, generateTestTrades } from './helpers'

describe("matchBuyOrders", () => {
  test("return the submitted order when there are no matched orders", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '0.9', amount: '1', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
      { type: 'buy', price: '0.8', amount: '1', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#1" },
      { type: 'buy', price: '0.7', amount: '1', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#2" },
      { type: 'buy', price: '0.6', amount: '1', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#3" },
      { type: 'buy', price: '0.5', amount: '1', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#4" }
    ])
    const order = generateTestOrders([
      { type: 'sell', price: '1', amount: '1' }
    ])[0]
    const expectedMatchResults = { trades: [], orders: [order] }
    const receivedMatchResults = matchBuyOrders({ order, buyBook })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("match all orders, return trades and a rest order", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
      { type: 'buy', price: '0.8', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#1" },
      { type: 'buy', price: '0.7', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#2" },
      { type: 'buy', price: '0.6', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#3" },
      { type: 'buy', price: '0.5', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#4" }
    ])
    const order = generateTestOrders([
      { type: 'sell', price: '0.8', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'BUY#0', amount: '0.9' },
      { orderHash: 'BUY#1', amount: '0.8' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'sell', price: '0.8', amount: '1' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchBuyOrders({ order, buyBook })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  });

  // test("match a partially filled order, return a trade and a rest order", () => {
  //   const buyBook = generateTestOrders([
  //     { type: 'buy', price: '0.9', amount: '1', filled: '0.5', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
  //   ])
  //   const order = generateTestOrders([
  //     { type: 'sell', price: '0.8', amount: '3' }
  //   ])[0]
  //   // const expectedTrades = generateTestTrades([
  //   //   { orderHash: 'BUY#0', amount: '0.45' }
  //   // ])
  //   // const expectedOrders = generateTestOrders([
  //   //   { type: 'sell', price: '0.8', amount: '2.5' }
  //   // ])
  // })

  test("orders with higher prices should be matched first", () => {});

  test("if there are multiple orders of the same price, the older ones should be matched first", () => {})
})
