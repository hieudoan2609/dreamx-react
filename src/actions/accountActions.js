import Web3 from "web3";
import axios from "axios";

import {
  ACCOUNT_LOGIN,
  ACCOUNT_LOGOUT,
  ACCOUNT_METAMASK_UNAVAILABLE,
  ACCOUNT_METAMASK_WRONGNETWORK,
  ACCOUNT_LOADING,
  ACCOUNT_LOADED
} from "../actions/types";
import singletons, { setSingleton } from "../singletons";
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
      return;
    }

    if (window.ethereum.networkVersion !== app.networkId) {
      console.log(
        `wrong network, MetaMask network id: ${
          window.ethereum.networkVersion
        }, app network id: ${app.networkId}`
      );
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

      // TODO: LOAD USER INITIAL BALANCES
      // const balances = await axios.get(
      //   `https://api.odin.trade/balances/${address}`
      // );
      // const tokenWithInitialBalances = token.all;
      // let tokenWithUserBalances = [];

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

export const accountLogout = () => {
  return async dispatch => {
    dispatch({
      type: ACCOUNT_LOGOUT
    });
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
      dispatch({
        type: ACCOUNT_LOGOUT
      });
    });
    window.ethereum.on("accountsChanged", function(accounts) {
      dispatch({
        type: ACCOUNT_LOGOUT
      });
    });
  }
};
