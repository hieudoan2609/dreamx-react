import axios from "axios";

import { APP_TOGGLE_THEME, APP_INITIALIZE } from "../actions/types";
import { tokensLoadAsync, marketsLoadAsync, tickersLoadAsync, orderBookLoadAsync } from ".";
import { getNetworkNameFromId } from "../helpers";
import config from "../config";
import { setSingleton } from "../singletons";
import ActionCable from "actioncable";

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
    initializeAppSingletons();
    const contract = await axios.get(
      `${config.API_HTTP_ROOT}/return_contract_address`
    );
    const fees = await axios.get(`${config.API_HTTP_ROOT}/fees`);
    await dispatch(tokensLoadAsync());
    await dispatch(marketsLoadAsync());
    await dispatch(tickersLoadAsync());
    await dispatch(orderBookLoadAsync())
    dispatch({
      type: APP_INITIALIZE,
      payload: {
        contractAddress: contract.data.address,
        networkId: contract.data.network_id,
        networkName: getNetworkNameFromId(contract.data.network_id),
        makerFee: fees.data.maker_fee_per_giving_token,
        makerMinimum: fees.data.maker_order_minimum_eth,
        takerFee: fees.data.taker_fee_per_giving_token,
        takerMinimum: fees.data.taker_order_minimum_eth
      }
    });
  };
};

const initializeAppSingletons = () => {
  const cable = ActionCable.createConsumer(config.API_WS_ROOT);
  setSingleton("cable", cable);
};
