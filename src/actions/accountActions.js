import Web3 from "web3";
import axios from "axios";

import {
  ACCOUNT_LOGIN,
  ACCOUNT_LOGOUT,
  ACCOUNT_METAMASK_UNAVAILABLE,
  ACCOUNT_METAMASK_WRONGNETWORK,
  ACCOUNT_LOADING,
  ACCOUNT_LOADED,
  ACCOUNT_METAMASK_NOTREADY,
  TOKENS_LOAD
} from "../actions/types";
import { transferHide } from "./";
import { setSingleton } from "../singletons";
import Exchange from "../ABI/Exchange.json";
import ERC20 from "../ABI/ERC20.json";
import config from "../config";

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
      return;
    }

    if (!window.ethereum.networkVersion) {
      dispatch({
        type: ACCOUNT_METAMASK_NOTREADY
      });
      return;
    }

    if (window.ethereum.networkVersion !== app.networkId) {
      dispatch({
        type: ACCOUNT_METAMASK_WRONGNETWORK
      });
      return;
    }

    try {
      const accounts = await window.ethereum.enable();
      const address = accounts[0];
      addMetamaskListeners(dispatch);
      initializeSingletons(app, tokens);
      await loadUserBalancesAsync(dispatch, address, tokens);

      dispatch({
        type: ACCOUNT_LOGIN,
        payload: { address }
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: ACCOUNT_LOADED
      });
      return;
    }
  };
};

const loadUserBalancesAsync = async (dispatch, address, tokens) => {
  const { HTTP_BASE_URL } = config;
  const balances = await axios.get(`${HTTP_BASE_URL}/balances/${address}`);
  let tokensWithUserBalances = tokens.all;
  for (let index in tokensWithUserBalances) {
    const token = tokensWithUserBalances[index];
    token.availableBalance = "0";
    token.inOrders = "0";
    token.totalBalance = "0";
    for (let balance of balances.data.records) {
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

export const accountLogout = () => {
  return async dispatch => {
    dispatchLogoutActions(dispatch);
  };
};

const initializeSingletons = (app, tokens) => {
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
