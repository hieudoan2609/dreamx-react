import { MARKET_LOAD, MARKET_LOADING, MARKET_LOADED } from "../actions/types";

const INITIAL_STATE = {
  currentMarket: "",
  loading: true,
  baseSymbol: "",
  quoteSymbol: "",
  pricePrecision: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARKET_LOADING:
      return { ...state, loading: true }
    case MARKET_LOADED:
      return { ...state, loading: false }
    case MARKET_LOAD:
      return { 
        ...state, 
        currentMarket: action.payload.currentMarket, 
        loading: false, 
        baseSymbol: action.payload.baseSymbol, 
        quoteSymbol: action.payload.quoteSymbol,
        pricePrecision: action.payload.pricePrecision
      };
    default:
      return state;
  }
};
