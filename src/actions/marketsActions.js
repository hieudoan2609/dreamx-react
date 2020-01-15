import axios from "axios";

import { MARKETS_LOAD } from "./types";
import config from "../config";
import { convertKeysToCamelCase } from "../helpers";

export const marketsLoadAsync = () => {
  return async dispatch => {
    const { API_HTTP_ROOT } = config;

    let markets;
    const marketsResponse = await axios.get(`${API_HTTP_ROOT}/markets`);
    markets = marketsResponse.data.records.map(market => {
      market = convertKeysToCamelCase(market)
      const [baseTokenSymbol, quoteTokenSymbol] = market.symbol.split("_")
      market.baseTokenSymbol = baseTokenSymbol
      market.quoteTokenSymbol = quoteTokenSymbol
      return market
    });

    dispatch({
      type: MARKETS_LOAD,
      payload: { data: markets }
    });
  };
};
