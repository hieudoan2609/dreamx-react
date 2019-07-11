import axios from 'axios'
import * as Web3Utils from 'web3-utils'

import {
  ORDER_BOOK_LOAD
} from "../actions/types";
import config from '../config'
import { processOrder, calculateTakeAmount } from "../helpers";
import singletons, { setSingleton } from "../singletons";

export const orderBookLoadAsync = (marketSymbol) => {
  return async (dispatch, getState) => {
    const { app } = getState()
    const takerMinimum = Web3Utils.toBN(app.takerMinimum)
    const { API_HTTP_ROOT } = config;
    const orderBooksResponse = await axios.get(`${API_HTTP_ROOT}/order_books/${marketSymbol}?per_page=1000`)
    let buyBook = []
    let sellBook = []
    let totalBuy = Web3Utils.toBN(0)
    let totalSell = Web3Utils.toBN(0)
    for (let order of orderBooksResponse.data.bid.records) {
      order = processOrder(getState, order)
      const takeAmount = Web3Utils.toBN(order.takeAmount)
      const giveAmount = Web3Utils.toBN(order.giveAmount)
      const filled = Web3Utils.toBN(order.filled)
      const filledTake = calculateTakeAmount(filled, giveAmount, takeAmount)
      const remainingTakeAmount = takeAmount.sub(filledTake)
      const remainingGiveAmount = giveAmount.sub(filled)
      // skip this order if its remaining volume doesn't meet taker's minimum
      if (remainingGiveAmount.lt(takerMinimum)) {
        continue
      }
      totalBuy = totalBuy.add(remainingTakeAmount)
      buyBook.push(order)
    }
    for (let order of orderBooksResponse.data.ask.records) {
      order = processOrder(getState, order)
      const giveAmount = Web3Utils.toBN(order.giveAmount)
      const filled = Web3Utils.toBN(order.filled)
      const remainingGiveAmount = giveAmount.sub(filled)
      // skip this order if its remaining volume doesn't meet taker's minimum
      if (remainingGiveAmount.lt(takerMinimum)) {
        continue
      }
      totalSell = totalSell.add(remainingGiveAmount)
      sellBook.push(order)
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
    const { cable, MarketOrdersChannel } = singletons;

    if (MarketOrdersChannel) {
      MarketOrdersChannel.unsubscribe()
    }

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
        if (newOrder.status !== 'closed') {
          updatedTotalBuy = updatedTotalBuy.add(Web3Utils.toBN(newOrder.takeAmount))
        }
      } else {
        updatedSellBook.push(newOrder)
        if (newOrder.status !== 'closed') {
          updatedTotalSell = updatedTotalSell.add(Web3Utils.toBN(newOrder.giveAmount))
        }
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
    updatedBuyBook = updatedBuyBook.filter(o => o.status !== 'closed')
    updatedSellBook = updatedSellBook.filter(o => o.status !== 'closed')
    updatedTotalBuy = updatedTotalBuy.toString()
    updatedTotalSell = updatedTotalSell.toString()
    dispatch({
      type: ORDER_BOOK_LOAD,
      payload: { buyBook: updatedBuyBook, sellBook: updatedSellBook, totalBuy: updatedTotalBuy, totalSell: updatedTotalSell }
    })
  }
}
