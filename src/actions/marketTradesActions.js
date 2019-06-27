import axios from 'axios'

import {
  MARKET_TRADES_LOAD
} from "../actions/types";
import config from '../config'
import { processTrade } from '../helpers'

export const marketTradesLoadAsync = (marketSymbol) => {
  return async (dispatch, getState) => {
    const { API_HTTP_ROOT } = config;

    const marketTradesResponse = await axios.get(`${API_HTTP_ROOT}/trades?market_symbol=${marketSymbol}`)
    const marketTrades = marketTradesResponse.data.records.map(t => processTrade(getState, t))
    
    dispatch({
      type: MARKET_TRADES_LOAD,
      payload: {
        all: marketTrades
      }
    })
  };
};
