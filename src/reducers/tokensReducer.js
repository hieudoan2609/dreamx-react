import { TOKEN_FILTER, TOKEN_LOAD } from "../actions/types";

const INITIAL_STATE = {
  all: [],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOKEN_LOAD:
      return {
        ...state,
        all: action.payload.tokens,
        filtered: action.payload.tokens
      };
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
