import axios from "axios";

import { TOKENS_FILTER, TOKENS_LOAD } from "../actions/types";
import config from "../config";

export const tokensFilter = searchValue => {
  return (dispatch, getState) => {
    const regex = new RegExp(searchValue, "gmi");
    const state = getState();
    const allTokens = state.tokens.all;

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
    const { HTTP_BASE_URL } = config;
    const tokens = await axios.get(`${HTTP_BASE_URL}/tokens`);

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
    const { tokens } = getState();
    const { HTTP_BASE_URL } = config;
    const balancesResponse = await axios.get(
      `${HTTP_BASE_URL}/balances/${accountAddress}`
    );
    let tokensWithUserBalances = tokens.all;
    for (let index in tokensWithUserBalances) {
      const token = tokensWithUserBalances[index];
      token.availableBalance = "0";
      token.inOrders = "0";
      token.totalBalance = "0";
      for (let balance of balancesResponse.data.records) {
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
        tokens: tokensWithUserBalances
      }
    });
  };
};
