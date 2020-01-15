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
    balance = balance.toString()

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
  let filled
  if (order.filled) {
    filled = order.type === "sell" ? order.filled : calculateTakeAmount(Web3Utils.toBN(order.filled), giveAmount, takeAmount).toString()
  } else {
    filled = "0"
  }
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
      (m.baseTokenAddress === order.giveTokenAddress &&
        m.quoteTokenAddress === order.takeTokenAddress) ||
      (m.quoteTokenAddress === order.giveTokenAddress &&
        m.baseTokenAddress === order.takeTokenAddress)
  )[0];
  order.marketSymbol = market.symbol;
  order.marketSymbolFormatted = `${market.quoteTokenSymbol}/${market.baseTokenSymbol}`;
  order.type =
    order.giveTokenAddress === market.baseTokenAddress
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

export const processTrade = (getState, trade) => {
  const { markets, account } = getState()
  trade = convertKeysToCamelCase(trade)
  const market = markets.all.filter(
    m =>
      (m.baseTokenAddress === trade.giveTokenAddress &&
        m.quoteTokenAddress === trade.takeTokenAddress) ||
      (m.quoteTokenAddress === trade.giveTokenAddress &&
        m.baseTokenAddress === trade.takeTokenAddress)
  )[0];
  trade.marketSymbol = market.symbol;
  trade.marketSymbolFormatted = `${market.quoteTokenSymbol}/${market.baseTokenSymbol}`;
  trade.type = trade.giveTokenAddress === market.baseTokenAddress ? "sell" : "buy";
  trade.price =
    trade.type === "buy"
      ? parseFloat(trade.takeAmount) / parseFloat(trade.giveAmount)
      : parseFloat(trade.giveAmount) / parseFloat(trade.takeAmount);
  trade.amount =
    trade.type === "buy"
      ? Web3Utils.fromWei(trade.giveAmount.toString())
      : Web3Utils.fromWei(trade.takeAmount.toString());
  trade.fee =
    trade.makerAddress === account.address
      ? Web3Utils.fromWei(trade.makerFee.toString())
      : Web3Utils.fromWei(trade.takerFee.toString());
  trade.total =
    trade.type === "buy"
      ? Web3Utils.fromWei(trade.takeAmount.toString())
      : Web3Utils.fromWei(trade.giveAmount.toString());
  return trade;
}