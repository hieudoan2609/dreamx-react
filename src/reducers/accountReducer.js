import {
  ACCOUNT_LOGIN,
  ACCOUNT_LOGOUT,
  ACCOUNT_METAMASK_UNAVAILABLE,
  ACCOUNT_METAMASK_WRONGNETWORK,
  ACCOUNT_LOADING,
  ACCOUNT_LOADED
} from "../actions/types";

const INITIAL_STATE = {
  address: "",
  metamask: "running",
  loading: false,
  transfers: [],
  trades: [],
  orders: [],
  assets: [
    {
      coin: "ETH",
      name: "Ethereum",
      totalBalance: 305,
      availableBalance: 3.7,
      inOrders: 67
    },
    {
      coin: "NJA",
      name: "NinjaCoin",
      totalBalance: 452,
      availableBalance: 25,
      inOrders: 51
    },
    {
      coin: "BNB",
      name: "Binance",
      totalBalance: 262,
      availableBalance: 16,
      inOrders: 24
    },
    {
      coin: "OMG",
      name: "OmiseGo",
      totalBalance: 159,
      availableBalance: 6,
      inOrders: 24
    }
  ]
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_LOADING:
      return { ...state, loading: true };
    case ACCOUNT_LOADED:
      return { ...state, loading: false };
    case ACCOUNT_METAMASK_WRONGNETWORK:
      return { ...state, metamask: "wrongnetwork", loading: false };
    case ACCOUNT_METAMASK_UNAVAILABLE:
      return { ...state, metamask: "unavailable", loading: false };
    case ACCOUNT_LOGIN:
      return {
        ...state,
        address: action.payload.address,
        metamask: "running",
        loading: false
      };
    case ACCOUNT_LOGOUT:
      return { ...state, address: "", loading: false };
    default:
      return state;
  }
};
