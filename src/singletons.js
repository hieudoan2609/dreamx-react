/*
available singletons:
{
  accountBalancesSubscription,
  accountTransfersSubscription,
  cable,
  exchange,
  tokens,
  web3
}
*/
const singletons = {};

export const setSingleton = (key, instance) => {
  singletons[key] = instance;
};

export default singletons;
