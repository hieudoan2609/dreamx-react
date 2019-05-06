import singletons from "./singletons";

export const getNetworkNameFromId = networkId => {
  networkId = parseInt(networkId);
  const networks = { Mainnet: 1, Kovan: 42, Ropsten: 3, Rinkeby: 4 };
  for (let network in networks) {
    if (networks[network] === networkId) {
      return network;
    }
  }
};

export const extractKeysFromObjectArray = (array, keys) => {
  let newArray = [];
  for (let object of array) {
    let newObject = {};
    for (let key of keys) {
      newObject[key] = object[key];
    }
    newArray.push(newObject);
  }
  return newArray;
};

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getOnchainBalanceAsync = async (accountAddress, tokenSymbol) => {
  return new Promise(async (resolve, reject) => {
    const { web3, tokens } = singletons;

    let balance;
    if (tokenSymbol === "ETH") {
      balance = web3.utils.fromWei(await web3.eth.getBalance(accountAddress));
    } else {
      const token = tokens[tokenSymbol];
      balance = web3.utils.fromWei(
        (await token.methods.balanceOf(accountAddress).call()).toString()
      );
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

  return parseFloat(num).toFixed(decimalPoints);
};
