import {
  ORDER_BOOK_LOAD
} from "../actions/types";

const INITIAL_STATE = {
  buyBook: [],
  sellBook: [],
  totalBuy: "0",
  totalSell: "0"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDER_BOOK_LOAD:
      return { ...state, buyBook: action.payload.buyBook, sellBook: action.payload.sellBook, totalBuy: action.payload.totalBuy, totalSell: action.payload.totalSell }
    default:
      return state;
  }
};
