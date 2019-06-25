import * as Web3Utils from 'web3-utils'

import { matchBuyOrders, matchSellOrders, generateTestOrders, generateTestTrades } from './helpers'

const makerMin = Web3Utils.toWei("0.15")
const takerMin = Web3Utils.toWei("0.05")

describe("matchBuyOrders", () => {
  test("return the submitted order when there are no matched orders", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
      { type: 'buy', price: '0.8', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#1" },
      { type: 'buy', price: '0.7', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#2" },
      { type: 'buy', price: '0.6', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#3" },
      { type: 'buy', price: '0.5', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#4" }
    ])
    const order = generateTestOrders([
      { type: 'sell', price: '1', amount: '1' }
    ])[0]
    const expectedMatchResults = { trades: [], orders: [order] }
    const receivedMatchResults = matchBuyOrders({ order, buyBook, makerMin, takerMin })
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
    const receivedMatchResults = matchBuyOrders({ order, buyBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  });

  test("match a partially filled order, return a trade and a rest order", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '0.9', amount: '1', filled: '0.5', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" }
    ])
    const order = generateTestOrders([
      { type: 'sell', price: '0.8', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'BUY#0', amount: '0.45' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'sell', price: '0.8', amount: '2.5' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchBuyOrders({ order, buyBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("orders with higher prices should be matched first", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '0.6', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#3" },
      { type: 'buy', price: '0.5', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#4" },
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
      { type: 'buy', price: '0.8', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#1" },
      { type: 'buy', price: '0.7', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#2" }
    ])
    const order = generateTestOrders([
      { type: 'sell', price: '0', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'BUY#0', amount: '0.9' },
      { orderHash: 'BUY#1', amount: '0.8' },
      { orderHash: 'BUY#2', amount: '0.7' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: [] }
    const receivedMatchResults = matchBuyOrders({ order, buyBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  });

  test("if there are multiple orders of the same price, the older ones should be matched first", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2018-06-19T20:25:59.459Z", orderHash: "BUY#1" },
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2017-06-19T20:25:59.459Z", orderHash: "BUY#2" },
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2016-06-19T20:25:59.459Z", orderHash: "BUY#3" },
      { type: 'buy', price: '0.9', amount: '1', filled: '0', createdAt: "2015-06-19T20:25:59.459Z", orderHash: "BUY#4" }
    ]) 
    const order = generateTestOrders([
      { type: 'sell', price: '0', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'BUY#4', amount: '0.9' },
      { orderHash: 'BUY#3', amount: '0.9' },
      { orderHash: 'BUY#2', amount: '0.9' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: [] }
    const receivedMatchResults = matchBuyOrders({ order, buyBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("rest order must meet maker's minimum", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '1', amount: '0.05', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
      { type: 'buy', price: '1', amount: '0.05', filled: '0', createdAt: "2018-06-19T20:25:59.459Z", orderHash: "BUY#1" },
      { type: 'buy', price: '1', amount: '0.05', filled: '0', createdAt: "2017-06-19T20:25:59.459Z", orderHash: "BUY#2" },
      { type: 'buy', price: '0.9', amount: '0.05', filled: '0', createdAt: "2016-06-19T20:25:59.459Z", orderHash: "BUY#3" },
      { type: 'buy', price: '0.8', amount: '0.05', filled: '0', createdAt: "2015-06-19T20:25:59.459Z", orderHash: "BUY#4" }
    ])
    const order = generateTestOrders([
      { type: 'sell', price: '1', amount: '0.24' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'BUY#2', amount: '0.05' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'sell', price: '1', amount: '0.19' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchBuyOrders({ order, buyBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("trades must meet taker's minimum", () => {
    const buyBook = generateTestOrders([
      { type: 'buy', price: '1', amount: '0.05', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "BUY#0" },
      { type: 'buy', price: '1', amount: '0.04', filled: '0', createdAt: "2018-06-19T20:25:59.459Z", orderHash: "BUY#1" },
      { type: 'buy', price: '1', amount: '0.04', filled: '0', createdAt: "2017-06-19T20:25:59.459Z", orderHash: "BUY#2" },
      { type: 'buy', price: '0.9', amount: '0.05', filled: '0', createdAt: "2016-06-19T20:25:59.459Z", orderHash: "BUY#3" },
      { type: 'buy', price: '0.8', amount: '0.05', filled: '0', createdAt: "2015-06-19T20:25:59.459Z", orderHash: "BUY#4" }
    ])
    const order = generateTestOrders([
      { type: 'sell', price: '1', amount: '0.3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'BUY#0', amount: '0.05' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'sell', price: '1', amount: '0.25' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchBuyOrders({ order, buyBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })
})

describe("matchSellOrders", () => {
  test("return the submitted order when there are no matched orders", () => {
    const sellBook = generateTestOrders([
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#0" },
      { type: 'sell', price: '1.6', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#1" },
      { type: 'sell', price: '1.7', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#2" },
      { type: 'sell', price: '1.8', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#3" },
      { type: 'sell', price: '1.9', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#4" }
    ])
    const order = generateTestOrders([
      { type: 'buy', price: '1', amount: '1' }
    ])[0]
    const expectedMatchResults = { trades: [], orders: [order] }
    const receivedMatchResults = matchSellOrders({ order, sellBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("match all orders, return trades and a rest order", () => {
    const sellBook = generateTestOrders([
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#0" },
      { type: 'sell', price: '1.6', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#1" },
      { type: 'sell', price: '1.7', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#2" },
      { type: 'sell', price: '1.8', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#3" },
      { type: 'sell', price: '1.9', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#4" }
    ])
    const order = generateTestOrders([
      { type: 'buy', price: '1.6', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'SELL#0', amount: '1' },
      { orderHash: 'SELL#1', amount: '1' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'buy', price: '1.6', amount: '1' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchSellOrders({ order, sellBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  });

  test("match a partially filled order, return a trade and a rest order", () => {
    const sellBook = generateTestOrders([
      { type: 'sell', price: '1.5', amount: '1', filled: '0.5', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#0" }
    ])
    const order = generateTestOrders([
      { type: 'buy', price: '1.6', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'SELL#0', amount: '0.5' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'buy', price: '1.6', amount: '2.5' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchSellOrders({ order, sellBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("orders with lower prices should be matched first", () => {
    const sellBook = generateTestOrders([
      { type: 'sell', price: '1.8', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#3" },
      { type: 'sell', price: '1.9', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#4" },
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#0" },
      { type: 'sell', price: '1.6', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#1" },
      { type: 'sell', price: '1.7', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#2" }
    ])
    const order = generateTestOrders([
      { type: 'buy', price: '2', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'SELL#0', amount: '1' },
      { orderHash: 'SELL#1', amount: '1' },
      { orderHash: 'SELL#2', amount: '1' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: [] }
    const receivedMatchResults = matchSellOrders({ order, sellBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  });

  test("if there are multiple orders of the same price, the older ones should be matched first", () => {
    const sellBook = generateTestOrders([
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#0" },
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2018-06-19T20:25:59.459Z", orderHash: "SELL#1" },
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2017-06-19T20:25:59.459Z", orderHash: "SELL#2" },
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2016-06-19T20:25:59.459Z", orderHash: "SELL#3" },
      { type: 'sell', price: '1.5', amount: '1', filled: '0', createdAt: "2015-06-19T20:25:59.459Z", orderHash: "SELL#4" }
    ])
    const order = generateTestOrders([
      { type: 'buy', price: '2', amount: '3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'SELL#4', amount: '1' },
      { orderHash: 'SELL#3', amount: '1' },
      { orderHash: 'SELL#2', amount: '1' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: [] }
    const receivedMatchResults = matchSellOrders({ order, sellBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("rest order must meet maker's minimum", () => {
    const sellBook = generateTestOrders([
      { type: 'sell', price: '1', amount: '0.05', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#0" },
      { type: 'sell', price: '1', amount: '0.05', filled: '0', createdAt: "2018-06-19T20:25:59.459Z", orderHash: "SELL#1" },
      { type: 'sell', price: '1', amount: '0.05', filled: '0', createdAt: "2017-06-19T20:25:59.459Z", orderHash: "SELL#2" },
      { type: 'sell', price: '1.5', amount: '0.5', filled: '0', createdAt: "2016-06-19T20:25:59.459Z", orderHash: "SELL#3" },
      { type: 'sell', price: '1.5', amount: '0.5', filled: '0', createdAt: "2015-06-19T20:25:59.459Z", orderHash: "SELL#4" }
    ])
    const order = generateTestOrders([
      { type: 'buy', price: '1', amount: '0.24' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'SELL#2', amount: '0.05' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'buy', price: '1', amount: '0.19' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchSellOrders({ order, sellBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })

  test("trades must meet taker's minimum", () => {
    const sellBook = generateTestOrders([
      { type: 'sell', price: '1', amount: '0.05', filled: '0', createdAt: "2019-06-19T20:25:59.459Z", orderHash: "SELL#0" },
      { type: 'sell', price: '1', amount: '0.04', filled: '0', createdAt: "2018-06-19T20:25:59.459Z", orderHash: "SELL#1" },
      { type: 'sell', price: '1', amount: '0.04', filled: '0', createdAt: "2017-06-19T20:25:59.459Z", orderHash: "SELL#2" },
      { type: 'sell', price: '1.5', amount: '0.5', filled: '0', createdAt: "2016-06-19T20:25:59.459Z", orderHash: "SELL#3" },
      { type: 'sell', price: '1.5', amount: '0.5', filled: '0', createdAt: "2015-06-19T20:25:59.459Z", orderHash: "SELL#4" }
    ])
    const order = generateTestOrders([
      { type: 'buy', price: '1', amount: '0.3' }
    ])[0]
    const expectedTrades = generateTestTrades([
      { orderHash: 'SELL#0', amount: '0.05' }
    ])
    const expectedOrders = generateTestOrders([
      { type: 'buy', price: '1', amount: '0.25' }
    ])
    const expectedMatchResults = { trades: expectedTrades, orders: expectedOrders }
    const receivedMatchResults = matchSellOrders({ order, sellBook, makerMin, takerMin })
    expect(receivedMatchResults).toEqual(expectedMatchResults)
  })
})
