import {
  TOKENS_FILTER,
  TOKENS_LOAD,
  TOKENS_CLEAR_FILTER
} from "../actions/types";

const INITIAL_STATE = {
  all: [],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOKENS_LOAD:
      return {
        ...state,
        all: action.payload.tokens,
        filtered: action.payload.tokens
      };
    case TOKENS_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    case TOKENS_CLEAR_FILTER:
      return {
        ...state,
        filtered: state.all,
        searchValue: ""
      };
    default:
      return state;
  }
};
