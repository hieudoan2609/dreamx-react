import axios from "axios";

import { TRANSFERS_FILTER, TRANSFERS_LOAD } from "./types";
import config from "../config";
import { convertKeysToCamelCase } from "../helpers";

export const transfersLoadAccountAsync = accountAddress => {
  return async dispatch => {
    const { HTTP_BASE_URL } = config;
    const transfersResponse = await axios.get(
      `${HTTP_BASE_URL}/transfers/${accountAddress}`
    );
    const transfers = transfersResponse.data.records.map(t =>
      convertKeysToCamelCase(t)
    );
    dispatch({
      type: TRANSFERS_LOAD,
      payload: { transfers }
    });
  };
};

export const transfersFilter = searchValue => {
  return (dispatch, getState) => {
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
