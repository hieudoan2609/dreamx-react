import axios from "axios";

import { TRANSFERS_FILTER, TRANSFERS_LOAD } from "./types";
import config from "../config";

export const transfersLoadAccountAsync = accountAddress => {
  return async dispatch => {
    const { HTTP_BASE_URL } = config;
    const transfersResponse = await axios.get(
      `${HTTP_BASE_URL}/transfers/${accountAddress}`
    );
    const deposits = transfersResponse.data.deposits.records;
    const withdraws = transfersResponse.data.withdraws.records;
    const transfers = deposits.concat(withdraws);
    dispatch({
      type: TRANSFERS_LOAD,
      payload: { transfers }
    });
  };
};
