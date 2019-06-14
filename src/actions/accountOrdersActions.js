import Web3 from 'web3'
import axios from 'axios'

import {
  ACCOUNT_ORDERS_FILTER,
  ACCOUNT_ORDERS_LOAD,
  ACCOUNT_ORDERS_CLEAR_FILTER
} from "../actions/types";
import config from '../config'
import { getOrderPriceAmountTotal, convertKeysToCamelCase } from "../helpers";

export const accountOrdersLoadAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { markets } = getState();
    const { API_HTTP_ROOT } = config;

    const ordersResponse = await axios.get(`${API_HTTP_ROOT}/orders?account_address=${accountAddress}&per_page=1000`)
    const accountOrders = ordersResponse.data.records.map(accountOrder => {
      accountOrder = convertKeysToCamelCase(accountOrder)
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
      accountOrder.price = Web3.utils.fromWei(getOrderPriceAmountTotal(accountOrder).price);
      accountOrder.amount = Web3.utils.fromWei(getOrderPriceAmountTotal(accountOrder).amount);
      accountOrder.total = Web3.utils.fromWei(getOrderPriceAmountTotal(accountOrder).total);
      accountOrder.filled = Web3.utils.fromWei(accountOrder.filled);
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
