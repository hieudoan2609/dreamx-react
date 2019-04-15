export const getNetworkNameFromId = networkId => {
  networkId = parseInt(networkId);
  const networks = { Mainnet: 1, Kovan: 42, Ropsten: 3, Rinkeby: 4 };
  for (let network in networks) {
    if (networks[network] === networkId) {
      return network;
    }
  }
};
