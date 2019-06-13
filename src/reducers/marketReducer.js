import { MARKET_CHANGE, MARKET_LOADING, MARKET_LOADED } from "../actions/types";

const INITIAL_STATE = {
  currentMarket: "",
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARKET_LOADING:
      return { ...state, loading: true }
    case MARKET_LOADED:
      return { ...state, loading: false }
    case MARKET_CHANGE:
      return { ...state, currentMarket: action.payload.currentMarket };
    default:
      return state;
  }
};
