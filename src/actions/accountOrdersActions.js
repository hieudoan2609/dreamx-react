import axios from 'axios'

import {
  ACCOUNT_ORDERS_FILTER,
  ACCOUNT_ORDERS_LOAD,
  ACCOUNT_ORDERS_CLEAR_FILTER
} from "../actions/types";
import singletons from "../singletons";
import config from '../config'
import { convertKeysToCamelCase } from "../helpers";

export const accountOrdersLoadAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { markets } = getState();
    const { web3 } = singletons;
    const { API_HTTP_ROOT } = config;

    const ordersResponse = await axios.get(`${API_HTTP_ROOT}/orders?account_address=${accountAddress}&per_page=1000`)
    const accountOrdersData = ordersResponse.data.records.map(o => convertKeysToCamelCase(o))
    const accountOrders = accountOrdersData.map(accountOrder => {
      const market = markets.all.filter(
        m =>
          (m.baseToken.address === accountOrder.giveTokenAddress &&
            m.quoteToken.address === accountOrder.takeTokenAddress) ||
          (m.quoteToken.address === accountOrder.giveTokenAddress &&
            m.baseToken.address === accountOrder.takeTokenAddress)
      )[0];
      accountOrder.marketSymbol = market.symbol;
      accountOrder.marketSymbolFormatted = `${market.quoteToken.symbol}/${market.baseToken.symbol}`;
      accountOrder.type =
        accountOrder.giveTokenAddress === market.baseToken.address
          ? "buy"
          : "sell";
      accountOrder.price =
        accountOrder.type === "sell"
          ? parseFloat(accountOrder.takeAmount) /
            parseFloat(accountOrder.giveAmount)
          : parseFloat(accountOrder.giveAmount) /
            parseFloat(accountOrder.takeAmount);
      accountOrder.amount =
        accountOrder.type === "sell"
          ? web3.utils.fromWei(accountOrder.giveAmount)
          : web3.utils.fromWei(accountOrder.takeAmount);
      accountOrder.total =
        accountOrder.type === "sell"
          ? web3.utils.fromWei(accountOrder.takeAmount)
          : web3.utils.fromWei(accountOrder.giveAmount);
      accountOrder.filled = web3.utils.fromWei(accountOrder.filled);
      return accountOrder;
    });

    dispatch({
      type: ACCOUNT_ORDERS_LOAD,
      payload: { data: accountOrders }
    });
  };
};

export const accountOrdersHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    dispatch(filterAccountOrders(searchValue));
  };
};

const filterAccountOrders = (searchValue, reApply = false) => {
  return (dispatch, getState) => {
    const { accountOrders, tokens } = getState();

    if (reApply) {
      searchValue = accountOrders.searchValue;
    }

    const regex = new RegExp(searchValue, "gmi");
    const allOrders = accountOrders.all;

    let filtered = [];
    for (let order of allOrders) {
      const giveToken = tokens.all.filter(
        t => t.address === order.giveTokenAddress
      )[0];
      const takeToken = tokens.all.filter(
        t => t.address === order.takeTokenAddress
      )[0];
      if (
        regex.test(giveToken.symbol) ||
        regex.test(giveToken.name) ||
        regex.test(takeToken.symbol) ||
        regex.test(takeToken.name)
      ) {
        filtered.push(order);
      }
    }

    dispatch({
      type: ACCOUNT_ORDERS_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const accountOrdersClearSearch = () => {
  return dispatch => {
    dispatch({
      type: ACCOUNT_ORDERS_CLEAR_FILTER
    });
  };
};
