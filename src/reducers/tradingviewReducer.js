import {
  TRADINGVIEW_LOADING,
  TRADINGVIEW_LOADED
} from "../actions/types";

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRADINGVIEW_LOADED:
      return { ...state, loading: false }
    case TRADINGVIEW_LOADING:
      return { ...state, loading: true }
    default:
      return state;
  }
};
