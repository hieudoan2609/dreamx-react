import {
  ACCOUNT_ORDERS_FILTER,
  ACCOUNT_ORDERS_CLEAR_FILTER,
  ACCOUNT_ORDERS_LOAD
} from "../actions/types";

const INITIAL_STATE = {
  all: [],
  filtered: [],
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_ORDERS_LOAD:
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
    case ACCOUNT_ORDERS_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    case ACCOUNT_ORDERS_CLEAR_FILTER:
      return {
        ...state,
        filtered: state.all,
        searchValue: ""
      };
    default:
      return state;
  }
};
