import _ from "lodash";
import Web3 from 'web3'

import singletons from "./singletons";

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

export const getOrderPriceAmountTotal = (order) => {
  const oneEther = Web3.utils.toBN(Web3.utils.toWei('1'))
  const takeAmount = Web3.utils.toBN(order.takeAmount)
  const giveAmount = Web3.utils.toBN(order.giveAmount)
  const price = order.type === "sell"
    ? (takeAmount.mul(oneEther).div(giveAmount)).toString()
    : (giveAmount.mul(oneEther).div(takeAmount)).toString();

  const amount = order.type === "sell"
    ? order.giveAmount
    : order.takeAmount;
  const total = order.type === "sell"
    ? order.takeAmount
    : order.giveAmount;
  return { price, amount, total }
}

export const extractBookData = (bookOrders) => {
  const prices = {}
  for (let order of bookOrders) {
    const { price, amount, total } = getOrderPriceAmountTotal(order)
    if (!prices[price]) {
      prices[price] = { amount, total }
    } else {
      prices[price].amount = (Web3.utils.toBN(prices[price].amount).add(Web3.utils.toBN(amount))).toString()
      prices[price].total = (Web3.utils.toBN(prices[price].total).add(Web3.utils.toBN(total))).toString()
    }
  }

  const extractedData = []
  for (let priceWei of Object.keys(prices)) {
    const price = truncateNumberOutput(Web3.utils.fromWei(priceWei), 8, 10)
    let { amount, total } = prices[priceWei]
    amount = truncateNumberOutput(Web3.utils.fromWei(amount), 2)
    total = truncateNumberOutput(Web3.utils.fromWei(total), 2)
    extractedData.push({ price, amount, total })
  }
  return extractedData
}

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
  order.price = Web3.utils.fromWei(getOrderPriceAmountTotal(order).price);
  order.amount = Web3.utils.fromWei(getOrderPriceAmountTotal(order).amount);
  order.total = Web3.utils.fromWei(getOrderPriceAmountTotal(order).total);
  return order;
}
