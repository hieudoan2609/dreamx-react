import axios from "axios";

import {
  TRANSFERS_FILTER,
  TRANSFERS_LOAD,
  TRANSFERS_CLEAR_FILTER
} from "./types";
import config from "../config";
import { convertKeysToCamelCase } from "../helpers";
import singletons, { setSingleton } from "../singletons";

export const transfersClearSearch = () => {
  return dispatch => {
    dispatch({
      type: TRANSFERS_CLEAR_FILTER
    });
  };
};

export const transfersLoadAccountAsync = accountAddress => {
  return async dispatch => {
    const { API_HTTP_ROOT } = config;

    let transfers;
    try {
      const transfersResponse = await axios.get(
        `${API_HTTP_ROOT}/transfers/${accountAddress}`
      );
      transfers = transfersResponse.data.records.map(t =>
        convertKeysToCamelCase(t)
      );
    } catch {
      transfers = [];
    }

    dispatch(initializeCableSubscriptions(accountAddress));

    dispatch({
      type: TRANSFERS_LOAD,
      payload: { transfers }
    });
  };
};

export const transfersHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    const regex = new RegExp(searchValue, "gmi");
    const { transfers, tokens } = getState();
    const allTransfers = transfers.all;

    let filtered = [];
    for (let transfer of allTransfers) {
      const token = tokens.all.filter(
        t => t.address === transfer.tokenAddress
      )[0];
      if (regex.test(token.symbol) || regex.test(token.name)) {
        filtered.push(transfer);
      }
    }

    dispatch({
      type: TRANSFERS_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const updateNewTransfersAsync = newTransfers => {
  return async (dispatch, getState) => {
    if (!(newTransfers instanceof Array)) {
      newTransfers = [newTransfers];
    }
    newTransfers.map(t => convertKeysToCamelCase(t));
    const { transfers } = getState();
    const updatedTransfers = transfers.all.concat(newTransfers);
    dispatch({
      type: TRANSFERS_LOAD,
      payload: { transfers: updatedTransfers }
    });
  };
};

const initializeCableSubscriptions = accountAddress => {
  return (dispatch, getState) => {
    const { cable } = singletons;

    const accountTransfersSubscription = cable.subscriptions.create(
      { channel: "AccountTransfersChannel", account_address: accountAddress },
      {
        connected: () => {},
        received: data => {
          // dispatch(loadTokenBalances(data.payload));
          console.log(data);
        }
      }
    );

    setSingleton("accountTransfersSubscription", accountTransfersSubscription);
  };
};
