import Web3 from "web3";

import {
  ACCOUNT_LOGIN,
  ACCOUNT_LOGOUT,
  ACCOUNT_METAMASK_UNAVAILABLE,
  ACCOUNT_METAMASK_WRONGNETWORK,
  ACCOUNT_LOADING,
  ACCOUNT_LOADED,
  ACCOUNT_METAMASK_NOTREADY
} from "../actions/types";
import {
  tokensLoadAccountAsync,
  transfersLoadAccountAsync,
  accountOrdersLoadAsync,
  accountTradesLoadAsync,
  appLoaded
} from ".";
import { transferHide } from "./";
import { setSingleton } from "../singletons";
import Exchange from "../ABI/Exchange.json";
import ERC20 from "../ABI/ERC20.json";

export const accountLoginAsync = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: ACCOUNT_LOADING
    });

    const { app, tokens } = getState();

    if (!window.ethereum || (window.ethereum && !window.ethereum.isMetaMask)) {
      dispatch({
        type: ACCOUNT_METAMASK_UNAVAILABLE
      });
      dispatch(appLoaded());
      return;
    }

    if (!window.ethereum.networkVersion) {
      dispatch({
        type: ACCOUNT_METAMASK_NOTREADY
      });
      dispatch(appLoaded());
      return;
    }

    if (window.ethereum.networkVersion !== app.networkId) {
      dispatch({
        type: ACCOUNT_METAMASK_WRONGNETWORK
      });
      dispatch(appLoaded());
      return;
    }

    try {
      const accounts = await window.ethereum.enable();
      const address = accounts[0];
      addMetamaskListeners(dispatch);
      initializeAccountSingletons(app, tokens);
      await dispatch(tokensLoadAccountAsync(address));
      await dispatch(transfersLoadAccountAsync(address));
      await dispatch(accountOrdersLoadAsync(address));
      await dispatch(accountTradesLoadAsync(address));
      dispatch({
        type: ACCOUNT_LOGIN,
        payload: { address }
      });
      dispatch(appLoaded());
    } catch (err) {
      dispatch({
        type: ACCOUNT_LOADED
      });
      dispatch(appLoaded());
      return;
    }
  };
};

export const accountLogout = () => {
  return async dispatch => {
    dispatchLogoutActions(dispatch);
  };
};

const initializeAccountSingletons = (app, tokens) => {
  const web3 = new Web3(Web3.givenProvider);
  const exchangeInstance = new web3.eth.Contract(Exchange, app.contractAddress);
  const tokenInstances = {};
  for (let token of tokens.all) {
    tokenInstances[token.symbol] = new web3.eth.Contract(ERC20, token.address);
  }
  setSingleton("web3", web3);
  setSingleton("exchange", exchangeInstance);
  setSingleton("tokens", tokenInstances);
};

const addMetamaskListeners = dispatch => {
  if (window.ethereum && process.env.NODE_ENV !== "test") {
    window.ethereum.autoRefreshOnNetworkChange = false;
    window.ethereum.removeAllListeners();
    window.ethereum.on("networkChanged", function(network) {
      dispatchLogoutActions(dispatch);
    });
    window.ethereum.on("accountsChanged", function(accounts) {
      dispatchLogoutActions(dispatch);
    });
  }
};

const dispatchLogoutActions = dispatch => {
  dispatch(transferHide());
  dispatch({
    type: ACCOUNT_LOGOUT
  });
};
