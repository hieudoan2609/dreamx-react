export const getNetworkNameFromId = networkId => {
  networkId = parseInt(networkId);
  const networks = { Mainnet: 1, Kovan: 42, Ropsten: 3, Rinkeby: 4 };
  for (let network in networks) {
    if (networks[network] === networkId) {
      return network;
    }
  }
};

export const excludeKeysFromObjectInArray = (array, keys) => {
  let newArray = [];
  for (let object of array) {
    let newObject = {};
    for (let key of Object.keys(object)) {
      if (keys.includes(key)) {
        continue;
      }
      newObject[key] = object[key];
    }
    newArray.push(newObject);
  }
  return newArray;
};
