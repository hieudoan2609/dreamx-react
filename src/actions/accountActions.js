import {
  ACCOUNT_LOGIN,
  ACCOUNT_LOGOUT,
  ACCOUNT_METAMASK_UNAVAILABLE,
  ACCOUNT_METAMASK_WRONGNETWORK,
  ACCOUNT_LOADING,
  ACCOUNT_LOADED
} from "../actions/types";

export const accountLogin = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: ACCOUNT_LOADING
    });

    const { exchange } = getState();

    if (!window.ethereum || (window.ethereum && !window.ethereum.isMetaMask)) {
      dispatch({
        type: ACCOUNT_METAMASK_UNAVAILABLE
      });
      return;
    }

    if (window.ethereum.networkVersion !== exchange.networkId) {
      dispatch({
        type: ACCOUNT_METAMASK_WRONGNETWORK
      });
      return;
    }

    try {
      const accounts = await window.ethereum.enable();
      addMetamaskListeners(dispatch);
      dispatch({
        type: ACCOUNT_LOGIN,
        payload: { address: accounts[0] }
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
