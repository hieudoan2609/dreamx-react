import axios from "axios";

import {
  APP_TOGGLE_THEME,
  APP_INITIALIZE,
  TOKENS_LOAD
} from "../actions/types";
import { getNetworkNameFromId } from "../helpers";
import config from "../config";

export const toggleTheme = () => {
  return async (dispatch, getState) => {
    const { app } = getState();
    const currentTheme = app.theme;
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.theme = nextTheme;
    dispatch({
      type: APP_TOGGLE_THEME,
      payload: { theme: nextTheme }
    });
  };
};

export const loadTheme = () => {
  return async dispatch => {
    if (localStorage.theme) {
      dispatch({
        type: APP_TOGGLE_THEME,
        payload: { theme: localStorage.theme }
      });
    }
  };
};

export const initializeAppAsync = () => {
  return async dispatch => {
    const { HTTP_BASE_URL } = config;
    const contract = await axios.get(
      `${HTTP_BASE_URL}/return_contract_address`
    );
    await loadTokensAsync(dispatch);
    dispatch({
      type: APP_INITIALIZE,
      payload: {
        contractAddress: contract.data.address,
        networkId: contract.data.network_id,
        networkName: getNetworkNameFromId(contract.data.network_id)
      }
    });
  };
};

const loadTokensAsync = async dispatch => {
  const { HTTP_BASE_URL } = config;
  const tokens = await axios.get(`${HTTP_BASE_URL}/tokens`);

  let tokensWithInitialBalances = [];
  for (let token of tokens.data.records) {
    token.totalBalance = token.availableBalance = token.inOrders = 0;
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
