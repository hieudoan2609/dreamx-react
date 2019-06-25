import _ from "lodash";
import * as Web3Utils from 'web3-utils'

import singletons from "./singletons";

const oneEther = Web3Utils.toBN(Web3Utils.toWei('1'))
const zero = Web3Utils.toBN('0')

export const getNetworkNameFromId = networkId => {
  networkId = parseInt(networkId);
  const networks = { mainnet: 1, kovan: 42, ropsten: 3, rinkeby: 4 };
  for (let network in networks) {
    if (networks[network] === networkId) {
      return network;
    }
  }
};

export const extractKeysFromObject = (object, keys) => {
  let newObject = {};
  for (let key of keys) {
    newObject[key] = object[key];
  }
  return newObject;
};

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getOnchainBalanceAsync = async (accountAddress, tokenSymbol) => {
  return new Promise(async (resolve, reject) => {
    const { web3, tokens } = singletons;

    let balance;
    if (tokenSymbol === "ETH") {
      balance = await web3.eth.getBalance(accountAddress);
    } else {
      const token = tokens[tokenSymbol];
      balance = await token.methods.balanceOf(accountAddress).call();
    }

    resolve(balance);
  });
};

export const round = num => {
  return Math.round(parseFloat(num) * 100000000) / 100000000;
};

export const roundFixed = (num, decimalPoints) => {
  if (!decimalPoints) {
    decimalPoints = 8;
  }

  return parseFloat(parseFloat(num).toFixed(decimalPoints)).toString();
};

export const truncateNumberOutput = (num, decimalPoints = 8, maxDigit) => {
  const trailingZeroes = /0*$|\.0*$/;
  let [whole, fraction] = num.toString().split(".");
  fraction = fraction ? fraction.substring(0, decimalPoints) : "";
  let result = fraction ? `${whole}.${fraction}`.replace(trailingZeroes, "") : whole;
  if (maxDigit) {
    result = fraction ? result.substring(0, maxDigit + 1) : result.substring(0, maxDigit)
    result = parseFloat(result).toString()
  }
  return result;
};

export const truncateNumberInput = (
  num,
  significantFigures = 8,
  decimalPoints = 8
) => {
  if (!num) {
    return ""
  }
  const nonNumeric =/\D/g
  const leadingZeroes = /^0*/;
  let [whole, fraction] = num.toString().split(".");
  whole = whole.replace(leadingZeroes, '').replace(nonNumeric, '');
  whole = whole ? whole.substring(0, significantFigures) : "0";
  fraction = fraction !== undefined ? fraction.substring(0, decimalPoints).replace(nonNumeric, '') : undefined;
  const result = fraction !== undefined ? `${whole}.${fraction}` : whole;
  if (isNaN(result)) {
    return ""
  }
  return result;
};

export const convertKeysToCamelCase = obj => {
  const keys = Object.keys(obj);
  for (let key of keys) {
    const camelCaseKey = _.camelCase(key);
    if (camelCaseKey === key) {
      continue;
    }
    obj[camelCaseKey] = obj[key];
    delete obj[key];
  }
  return obj;
};

export const getEtherscanTransaction = (transactionHash, networkName) => {
  let result;
  if (networkName === "mainnet") {
    result = `https://etherscan.io/tx/${transactionHash}`;
  } else {
    result = `https://${networkName}.etherscan.io/tx/${transactionHash}`;
  }
  return result;
};

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stableSort(rawArray, cmp) {
  const stabilizedThis = rawArray.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

// return { price, amount, filled, total }
export const getOrderVolume = (order) => {
  const takeAmount = Web3Utils.toBN(order.takeAmount)
  const giveAmount = Web3Utils.toBN(order.giveAmount)
  const price = order.type === "sell" ? (takeAmount.mul(oneEther).div(giveAmount)).toString() : (giveAmount.mul(oneEther).div(takeAmount)).toString();
  const amount = order.type === "sell" ? order.giveAmount : order.takeAmount;
  const filled = order.type === "sell" ? order.filled : calculateTakeAmount(Web3Utils.toBN(order.filled), giveAmount, takeAmount).toString()
  const total = order.type === "sell" ? order.takeAmount : order.giveAmount;
  return { price, amount, filled, total }
}

export const extractBookData = (bookOrders) => {
  const prices = {}
  for (let order of bookOrders) {
    let { price, amount, total } = getOrderVolume(order)
    amount = Web3Utils.toBN(amount)
    total = Web3Utils.toBN(total)
    const giveAmount = Web3Utils.toBN(order.giveAmount)
    const takeAmount = Web3Utils.toBN(order.takeAmount)
    const filled = Web3Utils.toBN(order.filled)
    const filledTakeAmount = calculateTakeAmount(filled, giveAmount, takeAmount)
    let remainingAmount, remainingTotal
    if (order.type === 'buy') {
      remainingAmount = amount.sub(filledTakeAmount)
      remainingTotal = total.sub(filled)
    } else {
      remainingAmount = amount.sub(filled)
      remainingTotal = total.sub(filledTakeAmount)
    }
    if (!prices[price]) {
      prices[price] = { amount: remainingAmount, total: remainingTotal }
    } else {
      prices[price].amount = (Web3Utils.toBN(prices[price].amount).add(remainingAmount)).toString()
      prices[price].total = (Web3Utils.toBN(prices[price].total).add(remainingTotal)).toString()
    }
  }

  const extractedData = []
  for (let priceWei of Object.keys(prices)) {
    const price = truncateNumberOutput(Web3Utils.fromWei(priceWei), 8, 10)
    let { amount, total } = prices[priceWei]
    amount = truncateNumberOutput(Web3Utils.fromWei(amount), 2)
    total = truncateNumberOutput(Web3Utils.fromWei(total), 2)
    extractedData.push({ price, amount, total })
  }
  return extractedData
}
// { filled, status, nonce, accountAddress, giveTokenAddress, giveAmount, takeTokenAddress, takeAmount, expiryTimestampInMilliseconds, orderHash, createdAt, marketSymbol, marketSymbolFormatted, type, price, amount, total }
export const processOrder = (getState, order) => {
  const { markets } = getState()
  order = convertKeysToCamelCase(order)
  const market = markets.all.filter(
    m =>
      (m.baseToken.address === order.giveTokenAddress &&
        m.quoteToken.address === order.takeTokenAddress) ||
      (m.quoteToken.address === order.giveTokenAddress &&
        m.baseToken.address === order.takeTokenAddress)
  )[0];
  order.marketSymbol = market.symbol;
  order.marketSymbolFormatted = `${market.quoteToken.symbol}/${market.baseToken.symbol}`;
  order.type =
    order.giveTokenAddress === market.baseToken.address
      ? "buy"
      : "sell";
  const { price, amount, filled, total } = getOrderVolume(order)
  order.price = price;
  order.amount = amount;
  order.amountFilled = filled;
  order.total = total;
  return order;
}

export const formatAttrNameToUserFriendly = name => {
  return name
    .split(/(?=[A-Z])/)
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const calculateTakeAmount = (giveAmount, totalGiveAmount, totalTakeAmount) => {
  if (giveAmount.eq(zero) || totalGiveAmount.eq(zero) || totalTakeAmount.eq(zero)) {
    return zero
  }

  return giveAmount.mul(totalTakeAmount).div(totalGiveAmount)
}

export const calculateGiveAmount = (takeAmount, totalGiveAmount, totalTakeAmount) => {
  if (takeAmount.eq(zero) || totalGiveAmount.eq(zero) || totalTakeAmount.eq(zero)) {
    return zero
  }

  return takeAmount.mul(totalGiveAmount).div(totalTakeAmount)
}

export const findMatchedOrders = ({ order, orderBook, makerMinimum, takerMinimum }) => {
  const { buyBook, sellBook } = orderBook
  let result
  if (order.type === 'buy') {
    result = matchSellOrders({ order, sellBook, makerMinimum, takerMinimum })
  } else {
    result = matchBuyOrders({ order, buyBook, makerMinimum, takerMinimum })
  }
  return result
}

// order = { giveTokenAddress, giveAmount, takeTokenAddress, takeAmount, type }
export const matchBuyOrders = ({ order, buyBook, makerMinimum, takerMinimum }) => {
  makerMinimum = Web3Utils.toBN(makerMinimum)
  takerMinimum = Web3Utils.toBN(takerMinimum)
  const result = { orders: [], trades: [] }
  const price = Web3Utils.toBN(getOrderVolume(order).price)
  const giveAmount = Web3Utils.toBN(order.giveAmount)
  const takeAmount = Web3Utils.toBN(order.takeAmount)
  let filledGiveAmount = Web3Utils.toBN(0)
  let remainingGiveAmount = Web3Utils.toBN(order.giveAmount)
  // find matched orders
  const matched = buyBook.filter(o => {
    const orderPrice = Web3Utils.toBN(getOrderVolume(o).price)
    return orderPrice.gte(price)
  }).sort((a, b) => {
  // sort matched orders by descending price and date
    const aPrice = Web3Utils.toBN(getOrderVolume(a).price)
    const bPrice = Web3Utils.toBN(getOrderVolume(b).price)
    const aCreatedAt = new Date(a.createdAt).getTime()
    const bCreatedAt = new Date(b.createdAt).getTime()
    if (aPrice.lt(bPrice)) {
      // a.price < b.price, b comes first
      return 1
    } else if (aPrice.gt(bPrice)) {
      // a.price > b.price, a comes first
      return -1
    } else if (aCreatedAt > bCreatedAt) {
      // a is more recently created, b comes first
      return 1
    } else if (aCreatedAt < bCreatedAt) {
      // a is older than b, a comes first
      return -1
    } else {
      // a and b are equal in price and date, keep their existing order
      return 0
    }
  })
  if (matched.length < 1) {
    result.orders.push({ type: order.type, giveAmount: order.giveAmount, giveTokenAddress: order.giveTokenAddress, takeAmount: order.takeAmount, takeTokenAddress: order.takeTokenAddress })
    return result
  }
  // fill matched orders
  for (let matchedOrder of matched) {
    if (filledGiveAmount.eq(giveAmount)) {
      break
    }
    const matchedOrderFilled = Web3Utils.toBN(matchedOrder.filled)
    const matchedOrderGiveAmount = Web3Utils.toBN(matchedOrder.giveAmount)
    const matchedOrderTakeAmount = Web3Utils.toBN(matchedOrder.takeAmount)
    const matchedOrderRemainingGiveAmount = matchedOrderGiveAmount.sub(matchedOrderFilled)
    // remaining amount of take tokens should be calculated by the matched order's give/take rate
    // because it is relative to the matched order's price
    const remainingTakeAmount = calculateTakeAmount(remainingGiveAmount, matchedOrderTakeAmount, matchedOrderGiveAmount)
    let trade, tradeAmount
    if (remainingTakeAmount.gt(matchedOrderRemainingGiveAmount)) {
      tradeAmount = matchedOrderRemainingGiveAmount
    } else {
      tradeAmount = remainingTakeAmount
    }
    if (tradeAmount.lt(takerMinimum)) {
      continue
    }
    // the amount of give tokens equivalent to the trade amount should be calculated by the matched order's give/take rate
    // because it is relative to the matched order's price
    const tradeAmountEquivalentInGiveToken = calculateGiveAmount(tradeAmount, matchedOrderTakeAmount, matchedOrderGiveAmount)
    // amountGive is used for refunding the matching order after trade cancelling, it will be removed before it is returned
    trade = { orderHash: matchedOrder.orderHash, amount: tradeAmount.toString(), amountGive: tradeAmountEquivalentInGiveToken }
    filledGiveAmount = filledGiveAmount.add(tradeAmountEquivalentInGiveToken)
    remainingGiveAmount = remainingGiveAmount.sub(tradeAmountEquivalentInGiveToken)
    result.trades.push(trade)
  }
  // create a rest order if there is still remaining volume
  if (!filledGiveAmount.eq(giveAmount)) {
    // remaining volume is below maker's minimum, cancel trades until it is back above
    while (remainingGiveAmount.lt(makerMinimum)) {
      const lastTrade = result.trades.pop()
      const tradeAmountEquivalentInGiveToken = lastTrade.amountGive
      filledGiveAmount = filledGiveAmount.sub(tradeAmountEquivalentInGiveToken)
      remainingGiveAmount = remainingGiveAmount.add(tradeAmountEquivalentInGiveToken)
    }
    let restOrderGiveAmount = remainingGiveAmount
    let restOrderTakeAmount = calculateTakeAmount(remainingGiveAmount, giveAmount, takeAmount)
    const restOrder = { type: order.type, giveAmount: restOrderGiveAmount.toString(), giveTokenAddress: order.giveTokenAddress, takeAmount: restOrderTakeAmount.toString(), takeTokenAddress: order.takeTokenAddress }
    result.orders.push(restOrder)
  }
  // remove amountGive before returning
  for (let trade of result.trades) {
    delete trade.amountGive
  }
  return result
}

export const matchSellOrders = ({ order, sellBook, makerMinimum, takerMinimum }) => {
  makerMinimum = Web3Utils.toBN(makerMinimum)
  takerMinimum = Web3Utils.toBN(takerMinimum)
  const result = { orders: [], trades: [] }
  const price = Web3Utils.toBN(getOrderVolume(order).price)
  const giveAmount = Web3Utils.toBN(order.giveAmount)
  const takeAmount = Web3Utils.toBN(order.takeAmount)
  let filledTakeAmount = Web3Utils.toBN(0)
  let remainingTakeAmount = Web3Utils.toBN(order.takeAmount)
  // find matched orders
  const matched = sellBook.filter(o => {
    const orderPrice = Web3Utils.toBN(getOrderVolume(o).price)
    return orderPrice.lte(price)
  }).sort((a, b) => {
  // sort matched orders by ascending price and date
    const aPrice = Web3Utils.toBN(getOrderVolume(a).price)
    const bPrice = Web3Utils.toBN(getOrderVolume(b).price)
    const aCreatedAt = new Date(a.createdAt).getTime()
    const bCreatedAt = new Date(b.createdAt).getTime()
    if (aPrice.lt(bPrice)) {
      // a.price < b.price, a comes first
      return -1
    } else if (aPrice.gt(bPrice)) {
      // a.price > b.price, b comes first
      return 1
    } else if (aCreatedAt > bCreatedAt) {
      // a is more recently created, b comes first
      return 1
    } else if (aCreatedAt < bCreatedAt) {
      // a is older than b, a comes first
      return -1
    } else {
      // a and b are equal in price and date, keep their existing order
      return 0
    }
  })
  if (matched.length < 1) {
    result.orders.push({ type: order.type, giveAmount: order.giveAmount, giveTokenAddress: order.giveTokenAddress, takeAmount: order.takeAmount, takeTokenAddress: order.takeTokenAddress })
    return result
  }
  // fill matched orders
  for (let matchedOrder of matched) {
    if (filledTakeAmount.eq(takeAmount)) {
      break
    }
    const matchedOrderFilled = Web3Utils.toBN(matchedOrder.filled)
    const matchedOrderGiveAmount = Web3Utils.toBN(matchedOrder.giveAmount)
    const matchedOrderRemainingGiveAmount = matchedOrderGiveAmount.sub(matchedOrderFilled)
    let trade, tradeAmount
    if (remainingTakeAmount.gt(matchedOrderRemainingGiveAmount)) {
      tradeAmount = matchedOrderRemainingGiveAmount
    } else {
      tradeAmount = remainingTakeAmount
    }
    if (tradeAmount.lt(takerMinimum)) {
      continue
    }
    trade = { orderHash: matchedOrder.orderHash, amount: tradeAmount.toString() }
    filledTakeAmount = filledTakeAmount.add(tradeAmount)
    remainingTakeAmount = remainingTakeAmount.sub(tradeAmount)
    result.trades.push(trade)
  }
  // create a rest order if there is still remaining volume
  if (!filledTakeAmount.eq(takeAmount)) {
    // remaining volume is below maker's minimum, cancel trades until it is back above
    while (remainingTakeAmount.lt(makerMinimum)) {
      const lastTrade = result.trades.pop()
      const tradeAmount = Web3Utils.toBN(lastTrade.amount)
      filledTakeAmount = filledTakeAmount.sub(tradeAmount)
      remainingTakeAmount = remainingTakeAmount.add(tradeAmount)
    }
    let restOrderGiveAmount = calculateGiveAmount(remainingTakeAmount, giveAmount, takeAmount)
    let restOrderTakeAmount = remainingTakeAmount
    const restOrder = { type: order.type, giveAmount: restOrderGiveAmount.toString(), giveTokenAddress: order.giveTokenAddress, takeAmount: restOrderTakeAmount.toString(), takeTokenAddress: order.takeTokenAddress }
    result.orders.push(restOrder)
  }
  return result
}

export const generateTestOrders = (orders) => {
  const defaultOrder = { 
    type: 'sell',
    price: '0',
    amount: '0',
    filled: '0',
    createdAt: '2019-06-19T20:25:59.459Z',
    orderHash: 'SELL#0'
  }
  const baseAddress = "0x0000000000000000000000000000000000000000"
  const quoteAddress = "0xe62cc4212610289d7374f72c2390a40e78583350"
  orders = orders.map(order => {
    const emptyAttrs = []
    // initialize undefined attrs with default ones
    for (let key of Object.keys(defaultOrder)) {
      if (!order[key]) {
        order[key] = defaultOrder[key]
        emptyAttrs.push(key)
      }
    }
    order.amount = Web3Utils.toBN(Web3Utils.toWei(order.amount))
    order.price = Web3Utils.toBN(Web3Utils.toWei(order.price))
    order.filled = Web3Utils.toBN(Web3Utils.toWei(order.filled))
    let giveTokenAddress, giveAmount, takeTokenAddress, takeAmount
    if (order.type === 'buy') {
      giveTokenAddress = baseAddress
      giveAmount = order.amount.mul(order.price).div(oneEther)
      takeTokenAddress = quoteAddress
      takeAmount = order.amount
    } else {
      giveTokenAddress = quoteAddress
      giveAmount = order.amount
      takeTokenAddress = baseAddress
      takeAmount = order.amount.mul(order.price).div(oneEther)
    }
    const createdAt = order.createdAt
    const orderHash = order.orderHash
    const type = order.type
    const filled = type === 'buy' ? calculateGiveAmount(order.filled, giveAmount, takeAmount) : order.filled
    order = { giveTokenAddress, giveAmount: giveAmount.toString(), takeTokenAddress, takeAmount: takeAmount.toString(), createdAt, orderHash, type, filled: filled.toString() }
    // remove undefined attrs
    for (let key of emptyAttrs) {
      delete order[key]
    }
    return order
  })
  return orders
}

export const generateTestTrades = (trades) => {
  trades = trades.map(trade => {
    trade.amount = Web3Utils.toWei(trade.amount)
    return trade
  })
  return trades
}
