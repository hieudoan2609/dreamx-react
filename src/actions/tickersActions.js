import axios from "axios";

import { TICKERS_LOAD, TICKERS_FILTER, TICKERS_CLEAR_FILTER } from "./types";
import config from "../config";
import { stableSort, getSorting, convertKeysToCamelCase } from "../helpers";
import singletons, { setSingleton } from "../singletons";

export const tickersLoadAsync = () => {
  return async (dispatch, getState) => {
    const { tokens } = getState();
    const { API_HTTP_ROOT } = config;

    const tickersData = (await axios.get(`${API_HTTP_ROOT}/tickers`)).data
      .records;
    tickersData.map(t => convertKeysToCamelCase(t));
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
      getSorting("ask", "marketSymbol")
    );

    dispatch(initializeCableSubscriptions());
    dispatch({
      type: TICKERS_LOAD,
      payload: { data: tickers }
    });
  };
};

const initializeCableSubscriptions = accountAddress => {
  return (dispatch, getState) => {
    const { cable } = singletons;

    const marketTickersSubscription = cable.subscriptions.create(
      { channel: "MarketTickersChannel" },
      {
        connected: () => {},
        received: data => {
          dispatch(updateTickersAsync(data.payload));
        }
      }
    );

    setSingleton("marketTickersSubscription", marketTickersSubscription);
  };
};

const updateTickersAsync = newTickers => {
  if (!Array.isArray(newTickers)) {
    newTickers = [newTickers];
  }

  return async (dispatch, getState) => {
    newTickers.map(t => convertKeysToCamelCase(t));
    const { tickers, tokens } = getState();

    const updatedTickers = tickers.all;
    for (let ticker of newTickers) {
      // fetch tickerSymbol and tickerName
      const quoteTokenSymbol = ticker.marketSymbol.split("_")[1];
      const quoteToken = tokens.all.filter(
        t => t.symbol === quoteTokenSymbol
      )[0];
      ticker.tickerSymbol = quoteToken.symbol;
      ticker.tickerName = quoteToken.name;

      const oldTicker = updatedTickers.filter(
        t => t.marketSymbol === ticker.marketSymbol
      )[0];
      if (!oldTicker) {
        updatedTickers.push(ticker);
      } else {
        const oldTickerIndex = updatedTickers
          .map(t => t.marketSymbol)
          .indexOf(oldTicker.marketSymbol);
        updatedTickers[oldTickerIndex] = ticker;
      }
    }

    dispatch({
      type: TICKERS_LOAD,
      payload: { data: updatedTickers }
    });

    dispatch(filterTickers(tickers.searchValue));
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
