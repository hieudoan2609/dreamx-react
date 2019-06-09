import { MARKET_CHANGE } from "../actions/types";

const INITIAL_STATE = {
  currentMarket: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARKET_CHANGE:
      return { ...state, currentMarket: action.payload.currentMarket };
    default:
      return state;
  }
};
