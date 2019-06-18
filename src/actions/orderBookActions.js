import axios from 'axios'
import * as Web3Utils from 'web3-utils'

import {
  ORDER_BOOK_LOAD
} from "../actions/types";
import config from '../config'
import { processOrder } from "../helpers";
import singletons, { setSingleton } from "../singletons";

export const orderBookLoadAsync = (marketSymbol) => {
  return async (dispatch, getState) => {
    const { API_HTTP_ROOT } = config;
    const orderBooksResponse = await axios.get(`${API_HTTP_ROOT}/order_books/${marketSymbol}?per_page=1000`)
    let buyBook = []
    let sellBook = []
    let totalBuy = Web3Utils.toBN(0)
    let totalSell = Web3Utils.toBN(0)
    for (let order of orderBooksResponse.data.bid.records) {
      buyBook.push(processOrder(getState, order))
      totalBuy = totalBuy.add(Web3Utils.toBN(order.takeAmount))
    }
    for (let order of orderBooksResponse.data.ask.records) {
      sellBook.push(processOrder(getState, order))
      totalSell = totalSell.add(Web3Utils.toBN(order.giveAmount))
    }
    totalBuy = totalBuy.toString()
    totalSell = totalSell.toString()
    dispatch(initializeCableSubscriptions(marketSymbol))
    dispatch({
      type: ORDER_BOOK_LOAD,
      payload: { buyBook, sellBook, totalBuy, totalSell }
    })
  };
};

const initializeCableSubscriptions = marketSymbol => {
  return dispatch => {
    const { cable } = singletons;

    const marketOrdersSubscription = cable.subscriptions.create(
      { channel: "MarketOrdersChannel", market_symbol: marketSymbol },
      {
        connected: () => {},
        received: data => {
          dispatch(updateOrderBookOrdersAsync(data.payload));
        }
      }
    );

    setSingleton("MarketOrdersChannel", marketOrdersSubscription);
  };
};

const updateOrderBookOrdersAsync = (newOrders) => {
  if (!Array.isArray(newOrders)) {
    newOrders = [newOrders];
  }

  return async (dispatch, getState) => {
    const { orderBook } = getState()

    let updatedBuyBook = []
    let updatedSellBook = []
    let updatedTotalBuy = Web3Utils.toBN(0)
    let updatedTotalSell = Web3Utils.toBN(0)
    for (let newOrder of newOrders) {
      newOrder = processOrder(getState, newOrder)
      if (newOrder.type === 'buy') {
        updatedBuyBook.push(newOrder)
        updatedTotalBuy = updatedTotalBuy.add(Web3Utils.toBN(newOrder.takeAmount))
      } else {
        updatedSellBook.push(newOrder)
        updatedTotalSell = updatedTotalSell.add(Web3Utils.toBN(newOrder.giveAmount))
      }
    }
    for (let order of orderBook.buyBook) {
      const newOrder = updatedBuyBook.filter(o => o.orderHash === order.orderHash)[0]
      if (!newOrder) {
        updatedBuyBook.push(order)
        updatedTotalBuy = updatedTotalBuy.add(Web3Utils.toBN(order.takeAmount))
      }
    }
    for (let order of orderBook.sellBook) {
      const newOrder = updatedSellBook.filter(o => o.orderHash === order.orderHash)[0]
      if (!newOrder) {
        updatedSellBook.push(order)
        updatedTotalSell = updatedTotalSell.add(Web3Utils.toBN(order.giveAmount))
      }
    }
    // remove closed orders
    updatedBuyBook = updatedBuyBook.filter(o => o.status === 'open')
    updatedSellBook = updatedSellBook.filter(o => o.status === 'open')
    updatedTotalBuy = updatedTotalBuy.toString()
    updatedTotalSell = updatedTotalSell.toString()
    dispatch({
      type: ORDER_BOOK_LOAD,
      payload: { buyBook: updatedBuyBook, sellBook: updatedSellBook, totalBuy: updatedTotalBuy, totalSell: updatedTotalSell }
    })
  }
}
