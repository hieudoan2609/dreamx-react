import { TOKEN_FILTER } from "../actions/types";

const INITIAL_STATE = {
  all: [
    {
      symbol: "ETH",
      name: "Ethereum",
      totalBalance: 305,
      availableBalance: 3.7,
      inOrders: 67
    },
    {
      symbol: "NJA",
      name: "NinjaCoin",
      totalBalance: 452,
      availableBalance: 25,
      inOrders: 51
    },
    {
      symbol: "BNB",
      name: "Binance",
      totalBalance: 262,
      availableBalance: 16,
      inOrders: 24
    },
    {
      symbol: "OMG",
      name: "OmiseGo",
      totalBalance: 159,
      availableBalance: 6,
      inOrders: 24
    }
  ],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOKEN_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    default:
      return state;
  }
};
