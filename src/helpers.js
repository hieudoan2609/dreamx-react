import _ from "lodash";
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

export const truncateNumberOutput = (num, decimalPoints = 8) => {
  const trailingZeroes = /0*$|\.0*$/;
  let [whole, fraction] = num.toString().split(".");
  fraction = fraction ? fraction.substring(0, decimalPoints) : "";
  const result = fraction
    ? `${whole}.${fraction}`.replace(trailingZeroes, "")
    : whole;
  return result;
};

export const truncateNumberInput = (
  num,
  significantFigures = 8,
  decimalPoints = 8
) => {
  const leadingZeroes = /^0*/;
  let [whole, fraction] = num.toString().split(".");
  whole = whole.replace(leadingZeroes, "");
  whole = whole ? whole.substring(0, significantFigures) : "0";
  fraction = fraction ? fraction.substring(0, decimalPoints) : "";
  const result = fraction ? `${whole}.${fraction}` : whole;
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
