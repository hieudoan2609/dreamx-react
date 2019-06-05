import {
  TRANSFERS_LOAD,
  TRANSFERS_FILTER,
  TRANSFERS_CLEAR_FILTER
} from "../actions/types";

const INITIAL_STATE = {
  all: [],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSFERS_LOAD:
      if (state.searchValue) {
        return {
          ...state,
          all: action.payload.transfers
        };
      } else {
        return {
          ...state,
          all: action.payload.transfers,
          filtered: action.payload.transfers
        };
      }
    case TRANSFERS_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    case TRANSFERS_CLEAR_FILTER:
      return {
        ...state,
        filtered: state.all,
        searchValue: ""
      };
    default:
      return state;
  }
};
