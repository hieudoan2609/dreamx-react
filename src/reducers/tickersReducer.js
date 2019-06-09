import {
  TICKERS_FILTER,
  TICKERS_CLEAR_FILTER,
  TICKERS_LOAD
} from "../actions/types";

const INITIAL_STATE = {
  all: [],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TICKERS_LOAD:
      if (state.searchValue) {
        return {
          ...state,
          all: action.payload.data
        };
      } else {
        return {
          ...state,
          all: action.payload.data,
          filtered: action.payload.data
        };
      }
    case TICKERS_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    case TICKERS_CLEAR_FILTER:
      return {
        ...state,
        filtered: state.all,
        searchValue: ""
      };
    default:
      return state;
  }
};
