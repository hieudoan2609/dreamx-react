import axios from 'axios'

import {
  MARKET_TRADES_LOAD
} from "../actions/types";
import config from '../config'

export const marketTradesLoadAsync = () => {
  return async dispatch => {
    // const { API_HTTP_ROOT } = config;
    // const marketTradesReponse = await axios.get(`${API_HTTP_ROOT}/trades/${marketSymbol}?per_page=1000`)
    dispatch({
      type: MARKET_TRADES_LOAD,
      payload: {
        all: []
      }
    })
  };
};
