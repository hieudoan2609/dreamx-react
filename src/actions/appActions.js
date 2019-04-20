import axios from "axios";

import { APP_TOGGLE_THEME, APP_INITIALIZE } from "../actions/types";
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
    const res = await axios.get(
      "https://api.odin.trade/return_contract_address"
    );
    dispatch({
      type: APP_INITIALIZE,
      payload: {
        address: res.data.address,
        networkId: res.data.network_id,
        networkName: getNetworkNameFromId(res.data.network_id)
      }
    });
  };
};
