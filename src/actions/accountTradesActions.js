import axios from 'axios'

import {
  ACCOUNT_TRADES_FILTER,
  ACCOUNT_TRADES_LOAD,
  ACCOUNT_TRADES_CLEAR_FILTER
} from "../actions/types";
import singletons from "../singletons";
import config from "../config";
import { convertKeysToCamelCase } from '../helpers'

export const accountTradesLoadAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { markets, account } = getState();
    const { web3 } = singletons;
    const { API_HTTP_ROOT } = config;

    const tradesResponse = await axios.get(`${API_HTTP_ROOT}/trades?account_address=${accountAddress}`)
    const accountTrades = tradesResponse.data.records.map(t => {
      t = convertKeysToCamelCase(t)
      const market = markets.all.filter(
        m =>
          (m.baseToken.address === t.giveTokenAddress &&
            m.quoteToken.address === t.takeTokenAddress) ||
          (m.quoteToken.address === t.giveTokenAddress &&
            m.baseToken.address === t.takeTokenAddress)
      )[0];
      t.marketSymbol = market.symbol;
      t.marketSymbolFormatted = `${market.quoteToken.symbol}/${market.baseToken.symbol}`;
      t.type = t.giveTokenAddress === market.baseToken.address ? "buy" : "sell";
      t.price =
        t.type === "sell"
          ? parseFloat(t.takeAmount) / parseFloat(t.giveAmount)
          : parseFloat(t.giveAmount) / parseFloat(t.takeAmount);
      t.amount =
        t.type === "sell"
          ? web3.utils.fromWei(t.giveAmount)
          : web3.utils.fromWei(t.takeAmount);
      t.fee =
        t.makerAddress === account.address
          ? web3.utils.fromWei(t.makerFee)
          : web3.utils.fromWei(t.takerFee);
      t.total =
        t.type === "sell"
          ? web3.utils.fromWei(t.takeAmount)
          : web3.utils.fromWei(t.giveAmount);
      return t;
    });

    dispatch({
      type: ACCOUNT_TRADES_LOAD,
      payload: { data: accountTrades }
    });
  };
};

export const accountTradesHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    dispatch(filterAccountTrades(searchValue));
  };
};

const filterAccountTrades = (searchValue, reApply = false) => {
  return (dispatch, getState) => {
    const { accountTrades, tokens } = getState();

    if (reApply) {
      searchValue = accountTrades.searchValue;
    }

    const regex = new RegExp(searchValue, "gmi");
    const allTrades = accountTrades.all;

    let filtered = [];
    for (let trade of allTrades) {
      const giveToken = tokens.all.filter(
        t => t.address === trade.giveTokenAddress
      )[0];
      const takeToken = tokens.all.filter(
        t => t.address === trade.takeTokenAddress
      )[0];
      if (
        regex.test(giveToken.symbol) ||
        regex.test(giveToken.name) ||
        regex.test(takeToken.symbol) ||
        regex.test(takeToken.name)
      ) {
        filtered.push(trade);
      }
    }

    dispatch({
      type: ACCOUNT_TRADES_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const accountTradesClearSearch = () => {
  return dispatch => {
    dispatch({
      type: ACCOUNT_TRADES_CLEAR_FILTER
    });
  };
};
