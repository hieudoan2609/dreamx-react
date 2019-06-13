import axios from 'axios'

import {
  ORDER_BOOK_LOAD
} from "../actions/types";
import config from '../config'
import { convertKeysToCamelCase } from "../helpers";

export const orderBookLoadAsync = (marketSymbol) => {
  return async (dispatch) => {
    const { API_HTTP_ROOT } = config;

    const orderBooksResponse = await axios.get(`${API_HTTP_ROOT}/order_books/${marketSymbol}?per_page=1000`)
    const buyBook = orderBooksResponse.data.bid.records.map(order => convertKeysToCamelCase(order))
    const sellBook = orderBooksResponse.data.ask.records.map(order => convertKeysToCamelCase(order))
    
    dispatch({
      type: ORDER_BOOK_LOAD,
      payload: { buyBook, sellBook }
    })
  };
};
