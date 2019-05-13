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
    const deposits = transfersResponse.data.deposits.records;
    const withdraws = transfersResponse.data.withdraws.records;
    const transfers = deposits
      .concat(withdraws)
      .map(t => convertKeysToCamelCase(t));
    dispatch({
      type: TRANSFERS_LOAD,
      payload: { transfers }
    });
  };
};

export const transfersFilter = searchValue => {
  return (dispatch, getState) => {
    const regex = new RegExp(searchValue, "gmi");
    const { transfers } = getState();
    const allTransfers = transfers.all;
    console.log(searchValue);

    // let filtered = [];
    // for (let transfer of allTransfers) {
    //   if (regex.test(token.symbol) || regex.test(token.name)) {
    //     filtered.push(token);
    //   }
    // }

    // dispatch({
    //   type: TOKENS_FILTER,
    //   payload: { filtered, searchValue }
    // });
  };
};
