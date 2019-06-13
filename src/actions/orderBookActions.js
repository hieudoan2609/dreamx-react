import axios from 'axios'

import {
  ORDER_BOOK_LOAD
} from "../actions/types";
import config from '../config'

export const orderBookLoadAsync = () => {
  return async (dispatch, getState) => {
    // const { market } = getState()
    // const { API_HTTP_ROOT } = config;

    // const orderBooksResponse = await axios.get(`${API_HTTP_ROOT}/order_books/${market.currentMarket}?per_page=1000`)
    
    // console.log(orderBooksResponse)
  };
};
