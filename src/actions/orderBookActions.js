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
    const { API_HTTP_ROOT } = config;
    const orderBooksResponse = await axios.get(`${API_HTTP_ROOT}/order_books/${marketSymbol}?per_page=1000`)
    const buyBook = orderBooksResponse.data.bid.records.map(order => processOrder(getState, order))
    const sellBook = orderBooksResponse.data.ask.records.map(order => processOrder(getState, order))
    dispatch(loadOrderBook({ buyBook, sellBook }))
    dispatch(initializeCableSubscriptions(marketSymbol))
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

    newOrders = newOrders.map(order => processOrder(getState, order))

    let buyBook = newOrders.filter(order => order.type === 'buy')
    for (let order of orderBook.buyBook) {
      const newOrder = buyBook.filter(newOrder => newOrder.orderHash === order.orderHash)[0]
      if (!newOrder) {
        buyBook.push(order)
      }
    }

    let sellBook = newOrders.filter(order => order.type === 'sell')
    for (let order of orderBook.sellBook) {
      const newOrder = sellBook.filter(newOrder => newOrder.orderHash === order.orderHash)[0]
      if (!newOrder) {
        sellBook.push(order)
      }
    }

    buyBook = buyBook.filter(order => order.status !== 'closed')
    sellBook = sellBook.filter(order => order.status !== 'closed')
    dispatch(loadOrderBook({ buyBook, sellBook }))
  }
}

const loadOrderBook = ({ buyBook, sellBook }) => {
  return dispatch => {
    let totalBuy = Web3Utils.toBN(0)
    let totalSell = Web3Utils.toBN(0)
    for (let order of buyBook) {
      const takeAmount = Web3Utils.toBN(order.takeAmount)
      const giveAmount = Web3Utils.toBN(order.giveAmount)
      const filled = Web3Utils.toBN(order.filled)
      const filledTake = calculateTakeAmount(filled, giveAmount, takeAmount)
      const remainingTakeAmount = takeAmount.sub(filledTake)
      totalBuy = totalBuy.add(remainingTakeAmount)
    }
    for (let order of sellBook) {
      const giveAmount = Web3Utils.toBN(order.giveAmount)
      const filled = Web3Utils.toBN(order.filled)
      const remainingGiveAmount = giveAmount.sub(filled)
      totalSell = totalSell.add(remainingGiveAmount)
    }
    totalBuy = totalBuy.toString()
    totalSell = totalSell.toString()
    dispatch({
      type: ORDER_BOOK_LOAD,
      payload: { buyBook, sellBook, totalBuy, totalSell }
    })
  }
}
