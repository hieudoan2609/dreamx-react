import axios from "axios";

import { MARKETS_LOAD } from "./types";
import config from "../config";
import { convertKeysToCamelCase } from "../helpers";

export const marketsLoadAsync = () => {
  return async dispatch => {
    const { API_HTTP_ROOT } = config;

    let markets;
    const marketsResponse = await axios.get(`${API_HTTP_ROOT}/markets`);
    markets = marketsResponse.data.records.map(t => convertKeysToCamelCase(t));

    dispatch({
      type: MARKETS_LOAD,
      payload: { data: markets }
    });
  };
};
