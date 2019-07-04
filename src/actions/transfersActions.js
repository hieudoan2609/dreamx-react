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
      payload: { data: transfers }
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
          dispatch(updateTransfersAsync(data.payload));
        }
      }
    );

    setSingleton("accountTransfersSubscription", accountTransfersSubscription);
  };
};

export const updateTransfersAsync = newTransfers => {
  if (!Array.isArray(newTransfers)) {
    newTransfers = [newTransfers];
  }

  return async (dispatch, getState) => {
    newTransfers.map(t => convertKeysToCamelCase(t));
    const { transfers } = getState();

    const updatedTransfers = []
    for (let newTransfer of newTransfers) {
      updatedTransfers.push(newTransfer)
    }
    for (let transfer of transfers.all) {
      const newTransfer = updatedTransfers.filter(t => t.id === transfer.id && t.type === transfer.type)[0]
      if (!newTransfer) {
        updatedTransfers.push(transfer)
      }
    }

    dispatch({
      type: TRANSFERS_LOAD,
      payload: { data: updatedTransfers }
    });

    dispatch(filterTransfers(transfers.searchValue));
  };
};

export const transfersHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    dispatch(filterTransfers(searchValue));
  };
};

const filterTransfers = searchValue => {
  return (dispatch, getState) => {
    const { transfers, tokens } = getState();

    const regex = new RegExp(searchValue, "gmi");
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
