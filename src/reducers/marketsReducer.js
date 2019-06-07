import {
  MARKETS_FILTER,
  MARKETS_CLEAR_FILTER,
  MARKETS_LOAD
} from "../actions/types";

const INITIAL_STATE = {
  all: [],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARKETS_LOAD:
      if (state.searchValue) {
        return {
          ...state,
          all: action.payload.markets
        };
      } else {
        return {
          ...state,
          all: action.payload.markets,
          filtered: action.payload.markets
        };
      }
    case MARKETS_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    case MARKETS_CLEAR_FILTER:
      return {
        ...state,
        filtered: state.all,
        searchValue: ""
      };
    default:
      return state;
  }
};
