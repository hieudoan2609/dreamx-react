import axios from 'axios'
import Web3 from 'web3'

import {
  ORDER_BOOK_LOAD
} from "../actions/types";
import config from '../config'
import { convertKeysToCamelCase } from "../helpers";

export const orderBookLoadAsync = (marketSymbol) => {
  return async (dispatch) => {
    const { API_HTTP_ROOT } = config;
    const orderBooksResponse = await axios.get(`${API_HTTP_ROOT}/order_books/${marketSymbol}?per_page=1000`)
    let buyBook = []
    let sellBook = []
    let totalBuy = Web3.utils.toBN(0)
    let totalSell = Web3.utils.toBN(0)
    for (let order of orderBooksResponse.data.bid.records) {
      buyBook.push(convertKeysToCamelCase(order))
      totalBuy = totalBuy.add(Web3.utils.toBN(order.takeAmount))
    }
    for (let order of orderBooksResponse.data.ask.records) {
      sellBook.push(convertKeysToCamelCase(order))
      totalSell = totalSell.add(Web3.utils.toBN(order.giveAmount))
    }
    totalBuy = totalBuy.toString()
    totalSell = totalSell.toString()
    dispatch({
      type: ORDER_BOOK_LOAD,
      payload: { buyBook, sellBook, totalBuy, totalSell }
    })
  };
};
