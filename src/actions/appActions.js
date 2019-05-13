import axios from "axios";

import { APP_TOGGLE_THEME, APP_INITIALIZE } from "../actions/types";
import { tokensLoadAsync } from ".";
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
    await dispatch(tokensLoadAsync());
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
