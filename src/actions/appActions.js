import axios from "axios";

import { APP_TOGGLE_THEME, APP_INITIALIZE, TOKEN_LOAD } from "../actions/types";
import { getNetworkNameFromId } from "../helpers";

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
    const contract = await axios.get(
      "https://api.odin.trade/return_contract_address"
    );
    const tokens = await axios.get("https://api.odin.trade/tokens");

    let tokensWithInitialBalances = [];
    for (let token of tokens.data.records) {
      token.totalBalance = token.availableBalance = token.inOrders = 0;
      token.decimals = parseInt(token.decimals);
      tokensWithInitialBalances.push(token);
    }

    dispatch({
      type: TOKEN_LOAD,
      payload: {
        tokens: tokensWithInitialBalances
      }
    });
    dispatch({
      type: APP_INITIALIZE,
      payload: {
        address: contract.data.address,
        networkId: contract.data.network_id,
        networkName: getNetworkNameFromId(contract.data.network_id)
      }
    });
  };
};
