import axios from 'axios'

import {
  ACCOUNT_ORDERS_FILTER,
  ACCOUNT_ORDERS_LOAD,
  ACCOUNT_ORDERS_CLEAR_FILTER,
  ACCOUNT_ORDERS_CANCEL_PENDING_ON,
  ACCOUNT_ORDERS_CANCEL_PENDING_OFF
} from "../actions/types";
import config from '../config'
import { processOrder } from "../helpers";
import singletons, { setSingleton } from "../singletons";
import { alertModalShowReadonlyAlert } from '.'

export const accountOrdersLoadAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { API_HTTP_ROOT } = config;

    const ordersResponse = await axios.get(`${API_HTTP_ROOT}/orders?account_address=${accountAddress}&per_page=1000`)
    const accountOrders = ordersResponse.data.records.map(accountOrder => processOrder(getState, accountOrder));

    dispatch(initializeCableSubscriptions(accountAddress))

    dispatch({
      type: ACCOUNT_ORDERS_LOAD,
      payload: { data: accountOrders }
    });
  };
};

const initializeCableSubscriptions = accountAddress => {
  return dispatch => {
    const { cable } = singletons;

    const accountOrdersSubscription = cable.subscriptions.create(
      { channel: "AccountOrdersChannel", account_address: accountAddress },
      {
        connected: () => {},
        received: data => {
          dispatch(updateAccountOrdersAsync(data.payload));
        }
      }
    );

    setSingleton("AccountOrdersChannel", accountOrdersSubscription);
  };
};

const updateAccountOrdersAsync = newOrders => {
  if (!Array.isArray(newOrders)) {
    newOrders = [newOrders];
  }

  return async (dispatch, getState) => {
    const { accountOrders } = getState();

    const updatedOrders = [];
    for (let newOrder of newOrders) {
      updatedOrders.push(processOrder(getState, newOrder))
    }
    for (let order of accountOrders.all) {
      const newOrder = updatedOrders.filter(o => o.orderHash === order.orderHash)[0]
      if (!newOrder) {
        updatedOrders.push(order)
      }
    }

    dispatch({
      type: ACCOUNT_ORDERS_LOAD,
      payload: { data: updatedOrders }
    });

    dispatch(filterAccountOrders(accountOrders.searchValue));
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

export const accountOrdersCancelAsync = (order) => {
  return async (dispatch, getState) => {
    const { app, accountOrders} = getState()
    if (order.status === 'closed' || accountOrders.cancelPending) {
      return;
    }
    dispatch({ type: ACCOUNT_ORDERS_CANCEL_PENDING_ON })
    const { API_HTTP_ROOT } = config
    const { orderHash, accountAddress } = order
    const contractAddress = app.contractAddress
    const payload = await generateOrderCancelPayloadAsync({ contractAddress, accountAddress, orderHash })

    if (!payload) {
      dispatch({ type: ACCOUNT_ORDERS_CANCEL_PENDING_OFF })
      return
    }

    try {
      await axios.post(
        `${API_HTTP_ROOT}/order_cancels`,
        payload
      );
    } catch (err) {
      if (err.toString() === "Error: Request failed with status code 503") {
        dispatch(alertModalShowReadonlyAlert())
      }
    }

    dispatch({ type: ACCOUNT_ORDERS_CANCEL_PENDING_OFF })
  }
}

const generateOrderCancelPayloadAsync = async ({ contractAddress, accountAddress, orderHash }) => {
  const { web3 } = singletons;
  const nonce = Date.now();
  const hash = web3.utils.soliditySha3(contractAddress, accountAddress, orderHash, nonce);

  try {
    const signature = await web3.eth.personal.sign(hash, accountAddress);
    const payload = {
      order_hash: orderHash,
      account_address: accountAddress,
      nonce,
      cancel_hash: hash,
      signature
    }
    return payload;
  } catch {
    return;
  }
}

export const accountOrdersCancelAllAsync = () => {
  return async (dispatch, getState) => {
    const { accountOrders } = getState()
    if (accountOrders.cancelPending) {
      return;
    }
    console.log('CANCEL ALL')
  }
}
