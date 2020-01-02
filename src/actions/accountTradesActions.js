import axios from 'axios'

import {
  ACCOUNT_TRADES_FILTER,
  ACCOUNT_TRADES_LOAD,
  ACCOUNT_TRADES_CLEAR_FILTER
} from "../actions/types";
import singletons, { setSingleton } from "../singletons";
import config from "../config";
import { processTrade } from '../helpers'

export const accountTradesLoadAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { API_HTTP_ROOT } = config;

    const tradesResponse = await axios.get(`${API_HTTP_ROOT}/trades?account_address=${accountAddress}`)
    const accountTrades = tradesResponse.data.records.map(t => processTrade(getState, t))

    dispatch(initializeCableSubscriptions(accountAddress))

    dispatch({
      type: ACCOUNT_TRADES_LOAD,
      payload: { data: accountTrades }
    });
  };
};

const initializeCableSubscriptions = accountAddress => {
  return dispatch => {
    const { cable } = singletons;

    const accountTradesSubscription = cable.subscriptions.create(
      { channel: "AccountTradesChannel", account_address: accountAddress },
      {
        connected: () => {},
        received: data => {
          dispatch(updateAccountTradesAsync(data.payload));
        }
      }
    );

    setSingleton("AccountTradesChannel", accountTradesSubscription);
  };
};

const updateAccountTradesAsync = newTrades => {
  if (!Array.isArray(newTrades)) {
    newTrades = [newTrades];
  }

  return async (dispatch, getState) => {
    const { accountTrades } = getState()

    const updatedTrades = [];
    for (let newTrade of newTrades) {
      updatedTrades.push(processTrade(getState, newTrade))
    }
    for (let trade of accountTrades.all) {
      const newTrade = updatedTrades.filter(t => t.id === trade.id)[0]
      if (!newTrade) {
        updatedTrades.push(trade)
      }
    }

    dispatch({
      type: ACCOUNT_TRADES_LOAD,
      payload: { data: updatedTrades }
    });

    dispatch(filterAccountTrades(accountTrades.searchValue));
  }
}

export const accountTradesHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    dispatch(filterAccountTrades(searchValue));
  };
};

const filterAccountTrades = (searchValue, reApply = false) => {
  return (dispatch, getState) => {
    const { accountTrades, tokens } = getState();

    if (reApply) {
      searchValue = accountTrades.searchValue;
    }

    const regex = new RegExp(searchValue, "gmi");
    const allTrades = accountTrades.all;

    let filtered = [];
    for (let trade of allTrades) {
      const giveToken = tokens.all.filter(
        t => t.address === trade.giveTokenAddress
      )[0];
      const takeToken = tokens.all.filter(
        t => t.address === trade.takeTokenAddress
      )[0];
      if (
        regex.test(giveToken.symbol) ||
        regex.test(giveToken.name) ||
        regex.test(takeToken.symbol) ||
        regex.test(takeToken.name)
      ) {
        filtered.push(trade);
      }
    }

    dispatch({
      type: ACCOUNT_TRADES_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const accountTradesClearSearch = () => {
  return dispatch => {
    dispatch({
      type: ACCOUNT_TRADES_CLEAR_FILTER
    });
  };
};
