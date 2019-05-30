import axios from "axios";

import {
  TOKENS_FILTER,
  TOKENS_LOAD,
  TOKENS_CLEAR_FILTER
} from "../actions/types";
import config from "../config";
import singletons, { setSingleton } from "../singletons";

export const tokensClearSearch = () => {
  return dispatch => {
    dispatch({
      type: TOKENS_CLEAR_FILTER
    });
  };
};

export const tokensHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    const regex = new RegExp(searchValue, "gmi");
    const { tokens } = getState();
    const allTokens = tokens.all;

    let filtered = [];
    for (let token of allTokens) {
      if (regex.test(token.symbol) || regex.test(token.name)) {
        filtered.push(token);
      }
    }

    dispatch({
      type: TOKENS_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const tokensLoadAsync = () => {
  return async dispatch => {
    const { API_HTTP_ROOT } = config;
    const tokens = await axios.get(`${API_HTTP_ROOT}/tokens`);

    let tokensWithInitialBalances = [];
    for (let token of tokens.data.records) {
      token.totalBalance = token.availableBalance = token.inOrders = "0";
      token.decimals = parseInt(token.decimals);
      [token.withdrawMinimum, token.withdrawFee] = [
        token.withdraw_minimum,
        token.withdraw_fee
      ];
      delete token.withdraw_minimum;
      delete token.withdraw_fee;
      tokensWithInitialBalances.push(token);
    }

    dispatch({
      type: TOKENS_LOAD,
      payload: {
        tokens: tokensWithInitialBalances
      }
    });
  };
};

export const tokensLoadAccountAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { API_HTTP_ROOT } = config;
    const balancesResponse = await axios.get(
      `${API_HTTP_ROOT}/balances/${accountAddress}`
    );
    const newBalances = balancesResponse.data.records;
    const reInitialize = true;
    dispatch(loadTokenBalances(newBalances, reInitialize));
    dispatch(initializeCableSubscriptions(accountAddress));
  };
};

const initializeCableSubscriptions = accountAddress => {
  return (dispatch, getState) => {
    const { cable } = singletons;

    const accountBalancesSubscription = cable.subscriptions.create(
      { channel: "AccountBalancesChannel", account_address: accountAddress },
      {
        connected: () => {},
        received: data => {
          dispatch(loadTokenBalances(data.payload));
        }
      }
    );

    setSingleton("accountBalancesSubscription", accountBalancesSubscription);
  };
};

const loadTokenBalances = (newBalances, reInitialize = false) => {
  return (dispatch, getState) => {
    const { tokens } = getState();
    let loadedBalances = tokens.all;
    for (let index in loadedBalances) {
      const token = loadedBalances[index];
      if (reInitialize) {
        token.availableBalance = "0";
        token.inOrders = "0";
        token.totalBalance = "0";
      }
      for (let balance of newBalances) {
        if (token.address === balance.token_address) {
          token.availableBalance = balance.balance;
          token.inOrders = balance.hold_balance;
          token.totalBalance = (
            parseInt(token.availableBalance) + parseInt(token.inOrders)
          ).toString();
        }
      }
    }
    dispatch({
      type: TOKENS_LOAD,
      payload: {
        tokens: loadedBalances
      }
    });
  };
};
