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

// export const getWalletBalance = (user, token) => {

// }
