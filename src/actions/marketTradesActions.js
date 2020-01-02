import axios from 'axios'

import {
  MARKET_TRADES_LOAD
} from "../actions/types";
import config from '../config'
import { processTrade } from '../helpers'
import singletons, { setSingleton } from "../singletons";

export const marketTradesLoadAsync = (marketSymbol) => {
  return async (dispatch, getState) => {
    const { API_HTTP_ROOT } = config;

    const marketTradesResponse = await axios.get(`${API_HTTP_ROOT}/trades?market_symbol=${marketSymbol}`)
    const marketTrades = marketTradesResponse.data.records.map(t => processTrade(getState, t))
    
    dispatch(initializeCableSubscriptions(marketSymbol))

    dispatch({
      type: MARKET_TRADES_LOAD,
      payload: { all: marketTrades }
    })
  };
};

const initializeCableSubscriptions = marketSymbol => {
  return dispatch => {
    const { cable, MarketTradesChannel } = singletons;

    if (MarketTradesChannel) {
      MarketTradesChannel.unsubscribe()
    }

    const marketTradesSubscription = cable.subscriptions.create(
      { channel: "MarketTradesChannel", market_symbol: marketSymbol },
      {
        connected: () => {},
        received: data => {
          dispatch(updateMarketTradesAsync(data.payload));
        }
      }
    );

    setSingleton("MarketTradesChannel", marketTradesSubscription);
  };
};

const updateMarketTradesAsync = (newTrades) => {
  if (!Array.isArray(newTrades)) {
    newTrades = [newTrades];
  }

  return async (dispatch, getState) => {
    const { marketTrades } = getState();

    const updatedTrades = [];
    for (let newTrade of newTrades) {
      updatedTrades.push(processTrade(getState, newTrade))
    }
    for (let trade of marketTrades.all) {
      const newTrade = updatedTrades.filter(t => t.id === trade.id)[0]
      if (!newTrade) {
        updatedTrades.push(trade)
      }
    }

    dispatch({
      type: MARKET_TRADES_LOAD,
      payload: { all: updatedTrades }
    });
  };
}
