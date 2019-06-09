// import axios from "axios";

import { TICKERS_LOAD } from "./types";
// import config from "../config";
// import { convertKeysToCamelCase } from "../helpers";

const tickersData = [
  {
    last: 0.00000385,
    high: 0.00000409,
    low: 0.00000381,
    marketSymbol: "ETH_ONE",
    lowestAsk: 0.00000386,
    highestBid: 0.00000384,
    percentChange: -5.4,
    baseVolume: 17.92612768,
    quoteVolume: "0"
  },
  {
    last: 114.617,
    high: 119.458,
    low: 111.476,
    marketSymbol: "ETH_TWO",
    lowestAsk: 114.581,
    highestBid: 114.561,
    percentChange: 3.67,
    baseVolume: 342361.403,
    quoteVolume: "0"
  },
  {
    last: 0.00079711,
    high: 0.00081868,
    low: 0.00078451,
    marketSymbol: "ETH_THREE",
    lowestAsk: 0.00079715,
    highestBid: 0.00079663,
    percentChange: 0,
    baseVolume: 6.38719962,
    quoteVolume: "0"
  }
];

export const tickersLoadAsync = () => {
  return async dispatch => {
    // const { API_HTTP_ROOT } = config;

    // const tickersResponse = await axios.get(`${API_HTTP_ROOT}/tickers`);
    // tickers = tickersResponse.data.records.map(t =>
    //     convertKeysToCamelCase(t)
    // );

    const tickers = tickersData.map(t => {
      const quoteTokenSymbol = t.marketSymbol.split("_")[1];
      t.name = `${quoteTokenSymbol}`;
      return t;
    });

    dispatch({
      type: TICKERS_LOAD,
      payload: { data: tickers }
    });
  };
};
