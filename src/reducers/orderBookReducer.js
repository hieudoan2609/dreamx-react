import {
  ORDER_BOOK_LOAD,
  ORDER_BOOK_LOADING
} from "../actions/types";

const INITIAL_STATE = {
  buyBook: [],
  sellBook: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDER_BOOK_LOAD:
      return { ...state, buyBook: action.payload.buyBook, sellBook: action.payload.sellBook, loading: false }
    default:
      return state;
  }
};
