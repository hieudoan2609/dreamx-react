import axios from "axios";

import { TICKERS_LOAD, TICKERS_FILTER, TICKERS_CLEAR_FILTER } from "./types";
import config from "../config";
import { stableSort, getSorting, convertKeysToCamelCase } from "../helpers";
// import { marketUpdateCurrentMarket } from ".";

export const tickersLoadAsync = () => {
  return async (dispatch, getState) => {
    const { tokens } = getState();

    const { API_HTTP_ROOT } = config;

    const tickersResponse = await axios.get(`${API_HTTP_ROOT}/tickers`);
    const tickersData = tickersResponse.data.records.map(t =>
      convertKeysToCamelCase(t)
    );
    const tickers = stableSort(
      tickersData.map(t => {
        const quoteTokenSymbol = t.marketSymbol.split("_")[1];
        const quoteToken = tokens.all.filter(
          t => t.symbol === quoteTokenSymbol
        )[0];
        t.tickerSymbol = quoteToken.symbol;
        t.tickerName = quoteToken.name;
        return t;
      }),
      getSorting("desc", "baseVolume")
    );
    // if (!market.currentMarket) {
    //   dispatch(marketUpdateCurrentMarket(tickers[0].marketSymbol));
    // }
    dispatch({
      type: TICKERS_LOAD,
      payload: { data: tickers }
    });
  };
};

export const tickersHandleSearchInput = e => {
  return dispatch => {
    const searchValue = e.target.value;
    dispatch(filterTickers(searchValue));
  };
};

const filterTickers = searchValue => {
  return (dispatch, getState) => {
    const { tickers } = getState();

    const regex = new RegExp(searchValue, "gmi");
    const allTickers = tickers.all;

    let filtered = [];
    for (let t of allTickers) {
      if (regex.test(t.tickerSymbol) || regex.test(t.tickerName)) {
        filtered.push(t);
      }
    }

    dispatch({
      type: TICKERS_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const tickersClearSearch = () => {
  return dispatch => {
    dispatch({
      type: TICKERS_CLEAR_FILTER
    });
  };
};
