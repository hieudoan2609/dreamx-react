import { TRANSFERS_LOAD, TRANSFERS_FILTER } from "../actions/types";

const INITIAL_STATE = {
  all: [],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSFERS_LOAD:
      return {
        ...state,
        all: action.payload.transfers,
        filtered: action.payload.transfers
      };
    case TRANSFERS_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    default:
      return state;
  }
};
