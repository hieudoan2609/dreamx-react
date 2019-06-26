import {
  MARKET_TRADES_LOAD
} from "../actions/types";

const INITIAL_STATE = {
  all: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARKET_TRADES_LOAD:
      return { ...state, all: action.payload.all }
    default:
      return state;
  }
};
